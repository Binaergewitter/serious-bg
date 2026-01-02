package handlers

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/binaergewitter/serious-go/internal/config"
	"github.com/binaergewitter/serious-go/internal/feed"
	"github.com/binaergewitter/serious-go/internal/model"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	Articles []*model.Article
	Pages    []*model.Page
}

type PageData struct {
	Config      ConfigData
	Article     *model.Article
	Page        *model.Page
	Recent      []*model.Article
	Archived    []*model.Article
	Pages       []*model.Page
	Category    string
	IsLive      bool
	SummaryOnly bool
}

type ConfigData struct {
	Title             string
	URL               string
	Description       string
	GoogleAnalyticsID string
	FeedURL           string
	Isso              bool
}

func New(articles []*model.Article, pages []*model.Page) *Handler {
	return &Handler{
		Articles: articles,
		Pages:    pages,
	}
}

func (h *Handler) Index(c *fiber.Ctx) error {
	category := c.Params("category")

	filtered := h.Articles
	if category != "" {
		filtered = filterByCategory(h.Articles, category)
	}

	limit := config.ItemsOnIndex
	offset := 0

	// Pagination or just basic split?
	// Serious.rb: @recent = Article.all(limit: ItemsOnIndex)
	// @archived = Article.all(limit: ArchivedOnIndex, offset: ItemsOnIndex)

	recentEnd := int(math.Min(float64(limit), float64(len(filtered))))
	recent := filtered[offset:recentEnd]

	archivedLimit := config.ArchivedOnIndex
	archivedStart := recentEnd
	archivedEnd := int(math.Min(float64(archivedStart+archivedLimit), float64(len(filtered))))
	var archived []*model.Article
	if archivedStart < len(filtered) {
		archived = filtered[archivedStart:archivedEnd]
	}

	data := h.baseData()
	data.Recent = recent
	data.Archived = archived
	data.Category = category

	if err := c.Render("index", data, "layout"); err != nil {
		fmt.Println("Index Render Error:", err)
		return err
	}
	return nil
}

func (h *Handler) Article(c *fiber.Ctx) error {
	year, _ := strconv.Atoi(c.Params("year"))
	month, _ := strconv.Atoi(c.Params("month"))
	day, _ := strconv.Atoi(c.Params("day"))
	slug := c.Params("slug")
	// Clean slug? "file.html"?

	// Find article
	var found *model.Article
	for _, a := range h.Articles {
		if a.Year == year && a.Month == month && a.Day == day && a.Slug == slug {
			found = a
			break
		}
	}

	if found == nil {
		return c.Status(404).SendString("Not Found")
	}

	data := h.baseData()
	data.Article = found

	if err := c.Render("partials/article", data, "layout"); err != nil {
		fmt.Println("Article Render Error:", err)
		return err
	}
	return nil
}

func (h *Handler) Archives(c *fiber.Ctx) error {
	category := c.Params("category")
	filtered := h.Articles
	if category != "" {
		filtered = filterByCategory(h.Articles, category)
	}

	data := h.baseData()
	data.Archived = filtered
	data.Category = category
	// "archives" template? The erb uses "archives" which renders _archives partial.
	// But `render_archived` helper was used.
	// We can render a generic page.
	// I didn't create `views/archives.html` but I have `_archives.html`.
	// I should create a container view or reuse index logic?
	// Serious.rb: erb :archives
	// archives.erb:
	// <h3>Archives...</h3>
	// <%= render_archived @articles %>

	// I'll assume I should create `views/archives.html` or just pass to layout with a specific view.
	// Let's create `views/archives.html` quickly inline or use valid template.
	// For now, I'll direct to index but with different data? No.
	// I'll assume `views/archives.html` exists (I will create it).
	return c.Render("archives", data, "layout")
}

func (h *Handler) Page(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" && c.Path() == "/live" {
		slug = "live"
	}

	var found *model.Page
	for _, p := range h.Pages {
		if p.Slug == slug {
			found = p
			break
		}
	}

	if found == nil {
		return c.Status(404).SendString("Not Found")
	}

	// Oh wait, PageData definition:
	// type PageData struct { ... Article *model.Article ... }
	// I can't put Page into Article.
	// I'll add CurrentPage to PageData.

	// For now, I'll pass map to render if I don't want to change struct again?
	// No, I should change struct to be correct.

	// Actually, `views/page.html` uses `.Page.Title`.
	// If I pass data as map: {"Page": found, "Config": ...}
	// But then I lose Navigation population if I don't pass Pages.
	// So better to use PageData.

	// Let's modify PageData structure first in a separate Step?
	// Or I can just pass a map for now that INCLUDES Pages.

	data := h.baseData()
	data.Page = found // Wait, Page field needed in PageData

	err := c.Render("page", data, "layout")

	if err != nil {
		fmt.Println("Page Render Error:", err)
		return err
	}
	return nil
}

func (h *Handler) Feed(c *fiber.Ctx) error {
	category := c.Params("category")
	format := c.Params("format") // "mp3", "m4a", "atom.xml", "rss.xml"
	if format == "" {
		// Root feed
		// /rss.xml or /atom.xml
		path := c.Path()
		if strings.HasSuffix(path, "atom.xml") {
			// atom logic? Serious.rb uses builder :rss for both
		}
	}

	// Splat handling in Fiber: /podcast_feed/*
	// c.Params("*")

	// Logic matches RenderRSS in feed package
	filtered := h.Articles
	if category != "" && category != "all" {
		filtered = filterByCategory(h.Articles, category)
	}

	// Determine format from URL structure
	// /podcast_feed/:category/:format/rss.xml
	feedFormat := c.Params("format") // "mp3"

	// Limit items in feed
	limit := config.ItemsInFeed
	if len(filtered) > limit {
		filtered = filtered[:limit]
	}

	feedXML, err := feed.RenderRSS(filtered, category, feedFormat, c.BaseURL()+c.OriginalURL(), "")
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	c.Set("Content-Type", "application/xml")
	return c.SendString(feedXML)
}

func filterByCategory(articles []*model.Article, category string) []*model.Article {
	var res []*model.Article
	for _, a := range articles {
		for _, c := range a.CategoryList() {
			if strings.EqualFold(c, category) {
				res = append(res, a)
				break
			}
		}
	}
	return res
}

func (h *Handler) baseData() PageData {
	return PageData{
		Config: getConfig(),
		Pages:  h.Pages,
		// Default values
		IsLive:      false,
		SummaryOnly: false,
	}
}

func getConfig() ConfigData {
	return ConfigData{
		Title:             config.Title,
		URL:               config.URL,
		Description:       config.Description,
		GoogleAnalyticsID: "",                      // config.GoogleAnalytics
		FeedURL:           config.URL + "/rss.xml", // Default
		Isso:              true,                    // config.Isso
	}
}
