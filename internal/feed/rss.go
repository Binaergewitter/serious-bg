package feed

import (
	"bytes"
	"fmt"
	"strings"
	"text/template"
	"time"

	"github.com/binaergewitter/serious-go/internal/config"
	"github.com/binaergewitter/serious-go/internal/model"
)

const rssTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:podcast="https://podcastindex.org/namespace/1.0" version="2.0">
  <channel>
    <title>{{ categoryTitle .Category }}</title>
    <link>{{ categoryURL .Category }}</link>
    <atom:link rel="self" href="{{ .CurrentURL }}" />
    {{ if .NextURL }}<atom:link rel="next" href="{{ .NextURL }}" />{{ end }}
    <description>{{ .Description }}</description>
    <language>de</language>
    {{ if .Articles }}
    <pubDate>{{ (index .Articles 0).DateTime | rfc2822 }}</pubDate>
    <lastBuildDate>{{ (index .Articles 0).DateTime | rfc2822 }}</lastBuildDate>
    {{ end }}
    <itunes:author>{{ .Author }}</itunes:author>
    <copyright>Creative Commons BY-SA 3.0 DE</copyright>

    <itunes:subtitle>Web, Technologie und OpenSource Software</itunes:subtitle>
    <itunes:summary>{{ .Description }}</itunes:summary>
    <itunes:keywords>technology, gadgets, web, opensource, krepel</itunes:keywords>
    <itunes:explicit>no</itunes:explicit>

    <itunes:image href="http://blog.binaergewitter.de/img/binaergewitter_logo_1400x1400.png" />
    <itunes:category text="Technology" />
    <itunes:owner>
      <itunes:name>Binärgewitter Crew</itunes:name>
      <itunes:email>info@binaergewitter.de</itunes:email>
    </itunes:owner>

    {{ range .Articles }}
    <item>
      <title>{{ .Title }}</title>
      <description>{{ .Summary }}</description>
      <pubDate>{{ .DateTime | rfc2822 }}</pubDate>
      <itunes:author>{{ $.Author }}</itunes:author>
      <itunes:summary>{{ .Summary }}</itunes:summary>
      <guid isPermaLink="false">{{ feedGUID . }}</guid>
      <link>{{ fullURL . }}</link>
      <content:encoded><![CDATA[{{ .Content }}]]></content:encoded>
      
      {{ $audio := getAudio . $.Format }}
      {{ if $audio.URL }}
      <enclosure url="{{ $audio.URL }}" length="{{ $audio.Length }}" type="{{ $audio.Type }}" />
      {{ end }}

      <itunes:duration>{{ duration . $.Format }}</itunes:duration>

      {{ range (voices .) }}
      <podcast:person>{{ . }}</podcast:person>
      {{ end }}

      <psc:chapters xmlns:psc="http://podlove.org/simple-chapters" version="1.2">
        {{ range (chapters .) }}
        <psc:chapter start="{{ .Start }}" title="{{ .Title }}" />
        {{ end }}
      </psc:chapters>
    </item>
    {{ end }}
  </channel>
</rss>`

type FeedData struct {
	Category    string
	Format      string
	CurrentURL  string
	NextURL     string
	Description string
	Author      string
	Articles    []*model.Article
}

// Helper structs
type AudioEnclosure struct {
	URL    string
	Length string
	Type   string
}

func RenderRSS(articles []*model.Article, category, format, currentURL, nextURL string) (string, error) {
	data := FeedData{
		Category:    category,
		Format:      format,
		CurrentURL:  currentURL,
		NextURL:     nextURL,
		Description: config.Description,
		Author:      config.Author,
		Articles:    articles,
	}

	funcMap := template.FuncMap{
		"categoryTitle": func(c string) string {
			if c == "" || c == "all" {
				return config.Title
			}
			return fmt.Sprintf("%s %s", config.Title, strings.Title(c))
		},
		"categoryURL": func(c string) string {
			if c == "" || c == "all" {
				return config.URL
			}
			return fmt.Sprintf("%s/categories/%s", config.URL, strings.ToLower(c))
		},
		"rfc2822": func(t time.Time) string {
			return t.Format(time.RFC1123Z)
		},
		"feedGUID": func(a *model.Article) string {
			url := a.FullURL()
			if a.Release != nil {
				return fmt.Sprintf("%s-%v", url, a.Release)
			}
			return url
		},
		"fullURL": func(a *model.Article) string {
			return a.FullURL()
		},
		"getAudio": func(a *model.Article, format string) AudioEnclosure {
			selectedCodec := format
			if strings.ToLower(format) == "itunes" {
				if _, ok := a.AudioFormats["m4a"]; ok {
					selectedCodec = "m4a"
				} else if _, ok := a.AudioFormats["mp3"]; ok {
					selectedCodec = "mp3"
				}
			}

			url, ok := a.AudioFormats[selectedCodec]
			if !ok {
				return AudioEnclosure{}
			}

			// Fetch Size
			size := "0"
			metaURL := strings.Replace(url, "."+selectedCodec, ".json", 1)
			if meta, err := GlobalCache.Fetch(metaURL); err == nil {
				for _, f := range meta.OutputFiles {
					if f.Ending == selectedCodec {
						size = fmt.Sprintf("%d", f.Size)
						break
					}
				}
			}

			return AudioEnclosure{
				URL:    url,
				Length: size,
				Type:   "audio/" + selectedCodec,
			}
		},
		"duration": func(a *model.Article, format string) string {
			selectedCodec := format
			if strings.ToLower(format) == "itunes" {
				if _, ok := a.AudioFormats["m4a"]; ok {
					selectedCodec = "m4a"
				} else if _, ok := a.AudioFormats["mp3"]; ok {
					selectedCodec = "mp3"
				}
			}

			url, ok := a.AudioFormats[selectedCodec]
			if !ok {
				for k, v := range a.AudioFormats {
					selectedCodec = k
					url = v
					break
				}
				if url == "" {
					return "00:00:00"
				}
			}

			metaURL := strings.Replace(url, "."+selectedCodec, ".json", 1)
			if meta, err := GlobalCache.Fetch(metaURL); err == nil {
				parts := strings.Split(meta.LengthTimestring, ".")
				return parts[0]
			}
			return "00:00:00"
		},
		"voices": func(a *model.Article) []string {
			var res []string
			for k, v := range a.Voices {
				if v {
					res = append(res, k)
				}
			}
			return res
		},
		"chapters": func(a *model.Article) []Chapter {
			if a.ChaptersURL == "" {
				return []Chapter{}
			}
			chapters, _ := GlobalChapterCache.Fetch(a.ChaptersURL)
			return chapters
		},
	}

	tmpl, err := template.New("rss").Funcs(funcMap).Parse(rssTemplate)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

// Better approach: method on Article in model?
// Or helper takes Article.
