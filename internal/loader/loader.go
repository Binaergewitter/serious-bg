package loader

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/binaergewitter/serious-go/internal/model"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"gopkg.in/yaml.v3"
)

var (
	mdParser goldmark.Markdown
)

func init() {
	mdParser = goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
			html.WithUnsafe(), // Allow raw HTML if needed
		),
	)
}

func LoadArticles(dir string) ([]*model.Article, error) {
	files, err := filepath.Glob(filepath.Join(dir, "*.markdown"))
	if err != nil {
		return nil, err
	}

	var articles []*model.Article

	for _, f := range files {
		a, err := loadArticle(f)
		if err != nil {
			fmt.Printf("Error loading %s: %v\n", f, err)
			continue
		}
		if a != nil {
			articles = append(articles, a)
		}
	}

	// Sort by Date Descending
	sort.Slice(articles, func(i, j int) bool {
		return articles[i].DateTime.After(articles[j].DateTime)
	})

	return articles, nil
}

func LoadPages(dir string) ([]*model.Page, error) {
	files, err := filepath.Glob(filepath.Join(dir, "*.markdown"))
	if err != nil {
		return nil, err
	}

	var pages []*model.Page
	for _, f := range files {
		p, err := loadPage(f)
		if err != nil {
			fmt.Printf("Error loading page %s: %v\n", f, err)
			continue
		}
		pages = append(pages, p)
	}

	// Sort by Title/Filename? Ruby sorts by path.
	sort.Slice(pages, func(i, j int) bool {
		return pages[i].Slug < pages[j].Slug
	})

	return pages, nil
}

// Common helper to parse frontmatter and content
func parseMarkdownFile(path string, target interface{}) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var frontmatterBuf bytes.Buffer
	var contentBuf bytes.Buffer
	state := 0

	for scanner.Scan() {
		line := scanner.Text()
		if state == 0 {
			if strings.TrimSpace(line) == "---" {
				state = 1
			}
			continue
		}
		if state == 1 {
			if strings.TrimSpace(line) == "---" {
				state = 2
				continue
			}
			frontmatterBuf.WriteString(line + "\n")
		} else {
			contentBuf.WriteString(line + "\n")
		}
	}

	if state != 2 {
		return "", fmt.Errorf("invalid frontmatter in %s", path)
	}

	if err := yaml.Unmarshal(frontmatterBuf.Bytes(), target); err != nil {
		return "", fmt.Errorf("yaml parse error: %v", err)
	}

	var htmlBuf bytes.Buffer
	if err := mdParser.Convert(contentBuf.Bytes(), &htmlBuf); err != nil {
		return "", fmt.Errorf("markdown convert error: %v", err)
	}

	// Return raw content for summary extraction if needed, but here we return HTML
	// The loadArticle needs raw content for summary.
	// So maybe duplicates are better or we return both?
	// Let's optimize: Return parsed HTML string.
	// BUT loadArticle uses raw content for extractSummary.
	// So we should return rawContent string too?
	return htmlBuf.String(), nil
}

// Adapted parse for Article to include raw content extraction
func parseArticleFile(path string, article *model.Article) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var frontmatterBuf bytes.Buffer
	var contentBuf bytes.Buffer
	state := 0

	for scanner.Scan() {
		line := scanner.Text()
		if state == 0 {
			if strings.TrimSpace(line) == "---" {
				state = 1
			}
			continue
		}
		if state == 1 {
			if strings.TrimSpace(line) == "---" {
				state = 2
				continue
			}
			frontmatterBuf.WriteString(line + "\n")
		} else {
			contentBuf.WriteString(line + "\n")
		}
	}

	if state != 2 {
		return fmt.Errorf("invalid frontmatter in %s", path)
	}

	if err := yaml.Unmarshal(frontmatterBuf.Bytes(), article); err != nil {
		return fmt.Errorf("yaml parse error: %v", err)
	}

	rawContent := contentBuf.String()
	article.OriginalBody = rawContent
	article.Summary = extractSummary(rawContent)

	var htmlBuf bytes.Buffer
	if err := mdParser.Convert(contentBuf.Bytes(), &htmlBuf); err != nil {
		return fmt.Errorf("markdown convert error: %v", err)
	}
	article.Content = htmlBuf.String()
	return nil
}

func loadPage(path string) (*model.Page, error) {
	filename := filepath.Base(path)
	slug := strings.TrimSuffix(filename, filepath.Ext(filename))

	page := &model.Page{
		Slug: slug,
	}

	// Reuse common logic?
	// Page doesn't need summary extraction from raw content.
	// So we can make a helper that returns (html, error) and taking interface{} for unmarshal.

	htmlContent, err := parseMarkdownFile(path, page)
	if err != nil {
		return nil, err
	}
	page.Content = htmlContent
	return page, nil
}

func loadArticle(path string) (*model.Article, error) {
	filename := filepath.Base(path)
	// Filename format: YYYY-MM-DD-slug.markdown
	re := regexp.MustCompile(`^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)\.markdown$`)
	matches := re.FindStringSubmatch(filename)
	if matches == nil {
		return nil, fmt.Errorf("invalid filename format: %s", filename)
	}

	year, _ := strconv.Atoi(matches[1])
	month, _ := strconv.Atoi(matches[2])
	day, _ := strconv.Atoi(matches[3])
	slug := matches[4]

	article := &model.Article{
		Path:  path,
		Slug:  slug,
		Year:  year,
		Month: month,
		Day:   day,
	}

	// Custom parsing for Article (needs raw content)
	if err := parseArticleFile(path, article); err != nil {
		return nil, err
	}

	// Parse Date
	// "2024-12-11 15:30"
	// Sometimes it might be just Date? Ruby code handled string or Date object.
	// We'll try parsing formatted string first, then fall back to filename date.
	parsedTime, err := time.Parse("2006-01-02 15:04", article.Date)
	if err != nil {
		// Try just date
		parsedTime, err = time.Parse("2006-01-02", article.Date)
	}

	if err == nil {
		article.DateTime = parsedTime
	} else {
		// Construct from filename
		article.DateTime = time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	}

	return article, nil
}

func extractSummary(content string) string {
	// Ruby: content.split("~~", 2).first.chomp
	// Check for "~~" separator
	parts := strings.SplitN(content, "~~", 2)
	summary := parts[0]

	// Also "Automatic Summary": anything before first header
	// Ruby:
	// parsed = content.split('##')[0]
	// if parsed.include?('#') ...
	// parsed.gsub!("\n",' ')
	// parsed.strip!

	// Simulating automatic summary if no explicit separator
	if len(parts) == 1 {
		// Simple heuristic: Take first paragraph or up to header
		idx := strings.Index(content, "##")
		if idx != -1 {
			summary = content[:idx]
		}
		// Further cleanup if needed
		summary = strings.Split(summary, "#")[0] // Case valid '#'
		summary = strings.Split(summary, "*")[0] // Case '*' list start?
	}

	summary = strings.ReplaceAll(summary, "\n", " ")
	summary = strings.TrimSpace(summary)
	return summary
}
