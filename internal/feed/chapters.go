package feed

import (
	"bufio"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"
)

type Chapter struct {
	Start string `json:"start"`
	Title string `json:"title"`
}

type ChapterCache struct {
	cache map[string][]Chapter
	mu    sync.RWMutex
}

var GlobalChapterCache = &ChapterCache{
	cache: make(map[string][]Chapter),
}

func (c *ChapterCache) Fetch(url string) ([]Chapter, error) {
	if url == "" {
		return []Chapter{}, nil
	}

	c.mu.RLock()
	if val, ok := c.cache[url]; ok {
		c.mu.RUnlock()
		return val, nil
	}
	c.mu.RUnlock()

	// Fetch
	client := http.Client{
		Timeout: 10 * time.Second,
	}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch chapters: status %d", resp.StatusCode)
	}

	var chapters []Chapter
	// Add Intro if missing? Original code:
	// chapters << { start: "00:00:00.000", title: "Intro" }
	chapters = append(chapters, Chapter{Start: "00:00:00.000", Title: "Intro"})

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.SplitN(line, " ", 2)
		if len(parts) == 2 {
			timeStr := parts[0]
			title := strings.TrimSpace(parts[1])
			title = strings.ReplaceAll(title, "\"", "'")
			chapters = append(chapters, Chapter{Start: timeStr, Title: title})
		}
	}

	c.mu.Lock()
	c.cache[url] = chapters
	c.mu.Unlock()

	return chapters, nil
}
