package feed

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type AuphonicMetadata struct {
	Length           float64 `json:"length"`
	LengthTimestring string  `json:"length_timestring"`
	OutputFiles      []struct {
		Ending string `json:"ending"` // mp3, ogg, etc
		Size   int64  `json:"size"`
	} `json:"output_files"`
}

type MetadataCache struct {
	cache map[string]*AuphonicMetadata
	mu    sync.RWMutex
}

var GlobalCache = &MetadataCache{
	cache: make(map[string]*AuphonicMetadata),
}

func (c *MetadataCache) Fetch(url string) (*AuphonicMetadata, error) {
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
		return nil, fmt.Errorf("failed to fetch metadata: status %d", resp.StatusCode)
	}

	var meta AuphonicMetadata
	if err := json.NewDecoder(resp.Body).Decode(&meta); err != nil {
		return nil, err
	}

	c.mu.Lock()
	c.cache[url] = &meta
	c.mu.Unlock()

	return &meta, nil
}
