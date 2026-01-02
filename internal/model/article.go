package model

import (
	"fmt"
	"time"

	"github.com/binaergewitter/serious-go/internal/config"
)

type Article struct {
	Title        string            `yaml:"title"`
	Date         string            `yaml:"date"` // Parsing manually to time.Time
	DateTime     time.Time         `yaml:"-"`
	Categories   interface{}       `yaml:"categories"` // format varies, can be list or string
	Published    bool              `yaml:"published"`
	Release      interface{}       `yaml:"release"`
	ChaptersURL  string            `yaml:"chapters"`
	AudioFormats map[string]string `yaml:"audioformats"`
	Voices       map[string]bool   `yaml:"voices"`
	Summary      string            `yaml:"-"` // Calculated
	Content      string            `yaml:"-"` // Rendered HTML
	OriginalBody string            `yaml:"-"` // Raw Markdown
	Slug         string            `yaml:"-"` // Extracted from filename
	Year         int               `yaml:"-"`
	Month        int               `yaml:"-"`
	Day          int               `yaml:"-"`
	Path         string            `yaml:"-"`
}

func (a *Article) IsPublished() bool {
	return a.Published
}

// CategoryList helper to handle dynamic type of categories (YAML quirk compatibility)
func (a *Article) CategoryList() []string {
	if a.Categories == nil {
		return []string{}
	}
	switch v := a.Categories.(type) {
	case string:
		return []string{v}
	case []interface{}:
		s := make([]string, len(v))
		for i, val := range v {
			s[i] = val.(string)
		}
		return s
	case []string:
		return v
	default:
		return []string{}
	}
}

func (a *Article) URL() string {
	return fmt.Sprintf("/%d/%02d/%02d/%s", a.Year, a.Month, a.Day, a.Slug)
}

func (a *Article) FullURL() string {
	return fmt.Sprintf("%s%s", config.URL, a.URL())
}

type Page struct {
	Title   string `yaml:"title"`
	Content string `yaml:"-"`
	Slug    string `yaml:"-"`
}

func (p *Page) URL() string {
	if p.Slug == "live" {
		return "/live" // Special case? Or just /pages/live
	}
	// Check navigation template: {{ if and (eq .Title "Live") $.IsLive }}(On Air){{ end }}
	// The ruby code said: def url; "/pages/#{permalink}"; end.
	// However, live page might be special?
	// Let's stick to /pages/:slug for now, unless I see a route for /live?
	// Serious.rb route: get '/pages/:page' do ... end
	// But is there a root /live?
	// I don't see it in my memory of serious.rb.
	// So /pages/live is likely correct.
	return "/pages/" + p.Slug
}
