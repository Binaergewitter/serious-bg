package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"log"
	"strings"
	"time"

	"github.com/binaergewitter/serious-go/internal/feed"
	"github.com/binaergewitter/serious-go/internal/handlers"
	"github.com/binaergewitter/serious-go/internal/loader"
	"github.com/binaergewitter/serious-go/internal/model"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	port := flag.String("port", "3000", "Port to listen on")
	flag.Parse()

	// Load Articles
	articles, err := loader.LoadArticles("articles")
	if err != nil {
		log.Fatalf("Failed to load articles: %v", err)
	}
	fmt.Printf("Loaded %d articles\n", len(articles))

	// Setup Engine
	engine := html.New("./views", ".html")
	registerTemplateFuncs(engine)

	// Init App
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Static Files from serious/lib/site/public -> /
	// We will copy them to public/ locally.
	app.Static("/", "./public")

	// Load Pages
	pages, err := loader.LoadPages("pages")
	if err != nil {
		log.Fatalf("Failed to load pages: %v", err)
	}
	fmt.Printf("Loaded %d pages\n", len(pages))

	h := handlers.New(articles, pages)

	// Routes
	app.Get("/", h.Index)
	app.Get("/categories/:category", h.Index)

	app.Get("/archives", h.Archives)
	app.Get("/archives/categories/:category", h.Archives)

	// Feed
	app.Get("/rss.xml", h.Feed)
	app.Get("/atom.xml", h.Feed)
	app.Get("/podcast_feed/:category/:format/rss.xml", h.Feed)
	app.Get("/podcast_feed/:category/:format/atom.xml", h.Feed)

	// Pages
	app.Get("/pages/:slug", h.Page)
	app.Get("/live", h.Page)

	// Article
	app.Get("/:year/:month/:day/:slug", h.Article)

	log.Fatal(app.Listen(":" + *port))
}

func registerTemplateFuncs(engine *html.Engine) {
	engine.AddFunc("dict", func(values ...interface{}) (map[string]interface{}, error) {
		if len(values)%2 != 0 {
			return nil, fmt.Errorf("dict expects even number of arguments")
		}
		dict := make(map[string]interface{}, len(values)/2)
		for i := 0; i < len(values); i += 2 {
			key, ok := values[i].(string)
			if !ok {
				return nil, fmt.Errorf("dict key must be string")
			}
			dict[key] = values[i+1]
		}
		return dict, nil
	})

	engine.AddFunc("replace", strings.ReplaceAll)
	engine.AddFunc("safeHTML", func(s string) template.HTML {
		return template.HTML(s)
	})
	engine.AddFunc("date", func(layout string, t time.Time) string {
		return t.Format(layout)
	})
	engine.AddFunc("categoryArchivePath", func(category string) string {
		if category == "" || category == "all" {
			return "/archives"
		}
		return "/archives/categories/" + strings.ToLower(category)
	})
	engine.AddFunc("chaptersJSON", func(a *model.Article) template.JS {
		if a.ChaptersURL == "" {
			return "[]"
		}
		chapters, _ := feed.GlobalChapterCache.Fetch(a.ChaptersURL)
		b, _ := json.Marshal(chapters)
		return template.JS(b)
	})
	engine.AddFunc("duration", func(a *model.Article, format string) string {
		selectedCodec := format
		// Logic matching RSS: "itunes" defaults: m4a > mp3
		if strings.ToLower(format) == "itunes" {
			if _, ok := a.AudioFormats["m4a"]; ok {
				selectedCodec = "m4a"
			} else if _, ok := a.AudioFormats["mp3"]; ok {
				selectedCodec = "mp3"
			}
		}

		url, ok := a.AudioFormats[selectedCodec]
		if !ok {
			// Fallback to first available
			for k, v := range a.AudioFormats {
				selectedCodec = k
				url = v
				break
			}
		}
		if url == "" {
			return "00:00:00"
		}

		metaURL := strings.Replace(url, "."+selectedCodec, ".json", 1)
		if meta, err := feed.GlobalCache.Fetch(metaURL); err == nil {
			parts := strings.Split(meta.LengthTimestring, ".")
			return parts[0]
		}
		return "00:00:00"
	})

	// Fixed audioSize implementation
	engine.AddFunc("audioSize", func(a *model.Article, format string) int64 {
		selectedCodec := format
		// Similar logic to duration/RSS
		if strings.ToLower(format) == "itunes" {
			if _, ok := a.AudioFormats["m4a"]; ok {
				selectedCodec = "m4a"
			} else if _, ok := a.AudioFormats["mp3"]; ok {
				selectedCodec = "mp3"
			}
		}

		url, ok := a.AudioFormats[selectedCodec]
		if !ok {
			return 0
		}

		metaURL := strings.Replace(url, "."+selectedCodec, ".json", 1)
		if meta, err := feed.GlobalCache.Fetch(metaURL); err == nil {
			// Auphonic JSON has OutputFiles list.
			// We need to match ending or just use summary size?
			// RenderRSS loop:
			// for _, f := range meta.OutputFiles { if f.Ending == selectedCodec ... }
			for _, f := range meta.OutputFiles {
				// Check if f.Ending matches codec (e.g. "mp3", "m4a")
				if f.Ending == selectedCodec {
					return f.Size
				}
			}
		}
		return 0
	})
}
