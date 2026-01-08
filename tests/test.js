#!/usr/bin/env node

/**
 * Hugo Site Tests
 * 
 * Tests for the Binärgewitter Hugo site to ensure:
 * - All audio links are valid
 * - RSS feeds validate
 * - Search index is properly formatted
 * - All pages build correctly
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Test configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const TESTS = {
    passed: 0,
    failed: 0,
    errors: []
};

// Helper: Make HTTP/HTTPS request
function fetchUrl(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { timeout }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ status: res.statusCode, headers: res.headers });
            } else {
                reject(new Error(`HTTP ${res.statusCode}`));
            }
        });
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Helper: Test assertion
function assert(condition, message) {
    if (condition) {
        TESTS.passed++;
        console.log(`✅ ${message}`);
    } else {
        TESTS.failed++;
        TESTS.errors.push(message);
        console.error(`❌ ${message}`);
    }
}

// Test 1: Search index is valid JSON
function testSearchIndex() {
    console.log('\n📋 Testing search index...');
    const indexPath = path.join(PUBLIC_DIR, 'index.json');

    try {
        const content = fs.readFileSync(indexPath, 'utf8');
        const data = JSON.parse(content);

        assert(Array.isArray(data), 'Search index is an array');
        assert(data.length > 0, `Search index contains ${data.length} entries`);

        // Check structure of first entry
        if (data.length > 0) {
            const first = data[0];
            assert(first.title, 'Search entries have title field');
            assert(first.permalink, 'Search entries have permalink field');
            assert(first.content, 'Search entries have content field');
        }

        // Check for specific known content
        const hasCephPost = data.some(item => item.title.includes('356'));
        assert(hasCephPost, 'Search index includes Talk #356 (Ceph post)');

    } catch (err) {
        assert(false, `Search index is valid JSON: ${err.message}`);
    }
}

// Test 2: RSS feeds are valid XML
function testRSSFeeds() {
    console.log('\n📡 Testing RSS feeds...');

    const feedDirs = [
        'podcast_feed/all/mp3',
        'podcast_feed/talk/mp3',
        'podcast_feed/spezial/mp3',
        'podcast_feed/talk/opus'
    ];

    feedDirs.forEach(dir => {
        const feedPath = path.join(PUBLIC_DIR, dir, 'rss.xml');

        if (fs.existsSync(feedPath)) {
            try {
                const content = fs.readFileSync(feedPath, 'utf8');

                // Basic XML validation
                assert(content.startsWith('<?xml'), `${dir}/rss.xml starts with XML declaration`);
                assert(content.includes('<rss'), `${dir}/rss.xml contains RSS tag`);
                assert(content.includes('<channel>'), `${dir}/rss.xml contains channel tag`);
                assert(content.includes('</rss>'), `${dir}/rss.xml is properly closed`);

                // Check for required podcast elements
                assert(content.includes('<enclosure'), `${dir}/rss.xml contains enclosures`);
                assert(content.includes('download.binaergewitter.de'), `${dir}/rss.xml has audio URLs`);

            } catch (err) {
                assert(false, `${dir}/rss.xml is valid: ${err.message}`);
            }
        } else {
            assert(false, `${dir}/rss.xml exists`);
        }
    });
}

// Test 3: Audio links are accessible (sample check)
async function testAudioLinks() {
    console.log('\n🎵 Testing audio links (sample)...');

    const feedPath = path.join(PUBLIC_DIR, 'podcast_feed/all/mp3/rss.xml');

    if (!fs.existsSync(feedPath)) {
        assert(false, 'Feed exists for audio link testing');
        return;
    }

    const content = fs.readFileSync(feedPath, 'utf8');
    const urlMatches = content.match(/https:\/\/download\.binaergewitter\.de\/[^"<]+\.mp3/g);

    if (!urlMatches || urlMatches.length === 0) {
        assert(false, 'Found audio URLs in feed');
        return;
    }

    // Test first 3 audio links
    const samplesToTest = urlMatches.slice(0, 3);

    for (const url of samplesToTest) {
        try {
            const result = await fetchUrl(url);
            assert(
                result.status === 200,
                `Audio file accessible: ${url.split('/').pop()}`
            );
        } catch (err) {
            assert(false, `Audio file accessible: ${url.split('/').pop()} - ${err.message}`);
        }
    }
}

// Test 4: Critical pages exist
function testCriticalPages() {
    console.log('\n📄 Testing critical pages...');

    const pages = [
        'index.html',
        'archives/index.html',
        'pages/abonnieren/index.html',
        'pages/ueber-uns/index.html',
        'pages/impressum/index.html'
    ];

    pages.forEach(page => {
        const pagePath = path.join(PUBLIC_DIR, page);
        assert(fs.existsSync(pagePath), `${page} exists`);
    });
}

// Test 5: Navigation links don't contain %20
function testNoEncodedSpaces() {
    console.log('\n🔗 Testing navigation links for URL encoding issues...');

    const indexPath = path.join(PUBLIC_DIR, 'index.html');

    if (!fs.existsSync(indexPath)) {
        assert(false, 'index.html exists for navigation testing');
        return;
    }

    const content = fs.readFileSync(indexPath, 'utf8');

    // Check for %20 in href attributes, but only for internal links (starting with ./ or /)
    const hrefMatches = content.match(/href="[^"]*"/g) || [];
    const encodedSpaceLinks = hrefMatches.filter(href => {
        // Only check internal links (relative URLs)
        const isInternal = href.includes('href="./') || (href.includes('href="/') && !href.includes('://'));
        return isInternal && href.includes('%20');
    });

    assert(
        encodedSpaceLinks.length === 0,
        `No internal navigation links contain %20 encoding (found ${encodedSpaceLinks.length})`
    );

    if (encodedSpaceLinks.length > 0) {
        console.log('  Internal links with %20:', encodedSpaceLinks.slice(0, 5));
    }
}

// Test 5: Search index is gzipped
function testSearchIndexGzip() {
    console.log('\n🗜️  Testing search index compression...');

    const jsonPath = path.join(PUBLIC_DIR, 'index.json');
    const gzPath = path.join(PUBLIC_DIR, 'index.json.gz');

    if (fs.existsSync(jsonPath) && fs.existsSync(gzPath)) {
        const jsonSize = fs.statSync(jsonPath).size;
        const gzSize = fs.statSync(gzPath).size;
        const ratio = ((1 - gzSize / jsonSize) * 100).toFixed(1);

        assert(gzSize < jsonSize, `Gzipped index is smaller (${ratio}% reduction)`);
    } else {
        console.log('⚠️  Gzipped index not found (only generated in Docker build)');
    }
}

// Test 6: Isso comments use relative paths without trailing slashes
function testIssoComments() {
    console.log('\n💬 Testing Isso comments configuration...');

    // Find a post page to test
    const postDirs = fs.readdirSync(PUBLIC_DIR)
        .filter(f => /^\d{4}$/.test(f)); // Year directories

    if (postDirs.length === 0) {
        console.log('⚠️  No post directories found to test Isso');
        return;
    }

    // Find first post HTML file
    let testPostPath = null;
    for (const year of postDirs.slice(0, 3)) {
        const yearPath = path.join(PUBLIC_DIR, year);
        const months = fs.readdirSync(yearPath).filter(f => fs.statSync(path.join(yearPath, f)).isDirectory());

        for (const month of months.slice(0, 2)) {
            const monthPath = path.join(yearPath, month);
            const days = fs.readdirSync(monthPath).filter(f => fs.statSync(path.join(monthPath, f)).isDirectory());

            for (const day of days.slice(0, 2)) {
                const dayPath = path.join(yearPath, month, day);
                const posts = fs.readdirSync(dayPath).filter(f => fs.statSync(path.join(dayPath, f)).isDirectory());

                if (posts.length > 0) {
                    testPostPath = path.join(dayPath, posts[0], 'index.html');
                    break;
                }
            }
            if (testPostPath) break;
        }
        if (testPostPath) break;
    }

    if (!testPostPath || !fs.existsSync(testPostPath)) {
        console.log('⚠️  Could not find a post to test Isso configuration');
        return;
    }

    const content = fs.readFileSync(testPostPath, 'utf8');

    // Check for isso-thread element with data-isso-id
    const issoThreadMatch = content.match(/<section[^>]*id="isso-thread"[^>]*data-isso-id="([^"]+)"/);

    if (issoThreadMatch) {
        const issoId = issoThreadMatch[1];

        // Should be a relative path
        assert(
            issoId.startsWith('/'),
            'Isso data-isso-id uses relative path (starts with /)'
        );

        // Should NOT have trailing slash (comments stored without it)
        assert(
            !issoId.endsWith('/'),
            'Isso data-isso-id has no trailing slash (matches comment storage format)'
        );

        // Should NOT contain domain or port
        assert(
            !issoId.includes('://') && !issoId.includes(':8080'),
            'Isso data-isso-id contains no domain or port'
        );
    } else {
        console.log('⚠️  Could not find isso-thread element in post');
    }
}

// Test 7: RSS GUIDs use relative URLs for stability
function testRSSGUIDs() {
    console.log('\n📻 Testing RSS feed GUID format...');

    const feedPath = path.join(PUBLIC_DIR, 'rss.xml');

    if (!fs.existsSync(feedPath)) {
        assert(false, 'RSS feed exists');
        return;
    }

    const content = fs.readFileSync(feedPath, 'utf8');

    // Find all GUIDs in the feed
    const guidMatches = content.match(/<guid[^>]*>([^<]+)<\/guid>/g);

    if (!guidMatches || guidMatches.length === 0) {
        assert(false, 'RSS feed contains GUIDs');
        return;
    }

    // Check first few GUIDs
    let relativeCount = 0;
    let absoluteCount = 0;

    guidMatches.slice(0, 5).forEach(guidTag => {
        const guidMatch = guidTag.match(/<guid[^>]*>([^<]+)<\/guid>/);
        if (guidMatch) {
            const guid = guidMatch[1];
            if (guid.startsWith('/')) {
                relativeCount++;
            } else if (guid.includes('://')) {
                absoluteCount++;
            }
        }
    });

    assert(
        relativeCount > 0 && absoluteCount === 0,
        `RSS GUIDs use relative paths (${relativeCount} relative, ${absoluteCount} absolute)`
    );

    if (absoluteCount > 0) {
        console.log('  ⚠️  Absolute GUIDs will cause podcatchers to mark episodes as new!');
    }
}

// Test 8: RSS feeds don't contain %20
function testRSSNoEncodedSpaces() {
    console.log('\n📡 Testing RSS feeds for URL encoding issues...');

    const feeds = [
        'rss.xml',
        'podcast_feed/all/mp3/rss.xml',
        'podcast_feed/talk/mp3/rss.xml'
    ];

    feeds.forEach(feed => {
        const feedPath = path.join(PUBLIC_DIR, feed);
        if (fs.existsSync(feedPath)) {
            const content = fs.readFileSync(feedPath, 'utf8');

            // Check for %20 in URLs (usually in enclosure url or link)
            const urlMatches = content.match(/(url|link)="[^"]*"/g) || [];
            const encodedSpaceUrls = urlMatches.filter(url => url.includes('%20'));

            assert(
                encodedSpaceUrls.length === 0,
                `No URLs in ${feed} contain %20 encoding (found ${encodedSpaceUrls.length})`
            );

            if (encodedSpaceUrls.length > 0) {
                console.log(`  Found %20 in ${feed}:`, encodedSpaceUrls.slice(0, 3));
            }
        }
    });
}

// Test 9: All articles have required front matter
function testArticleFrontMatter() {
    console.log('\n📝 Testing article front matter...');

    const articlesDir = path.join(__dirname, '../articles');
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));

    let validCount = 0;
    let invalidCount = 0;

    files.forEach(file => {
        const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');

        // Check for required front matter
        const hasTitle = /^title:/m.test(content);
        const hasDate = /^date:/m.test(content);

        if (hasTitle && hasDate) {
            validCount++;
        } else {
            invalidCount++;
            if (invalidCount <= 3) {
                console.log(`  ⚠️  ${file} missing required front matter`);
            }
        }
    });

    assert(
        invalidCount === 0,
        `All ${files.length} articles have required front matter (${validCount} valid, ${invalidCount} invalid)`
    );
}

// Main test runner
async function runTests() {
    console.log('🧪 Running Hugo Site Tests\n');
    console.log('='.repeat(50));

    // Check if public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error('❌ Public directory not found. Run `hugo` first.');
        process.exit(1);
    }

    // Run tests
    testSearchIndex();
    testRSSFeeds();
    testCriticalPages();
    testNoEncodedSpaces();
    testSearchIndexGzip();
    testIssoComments();
    testRSSGUIDs();
    testRSSNoEncodedSpaces();
    testArticleFrontMatter();
    await testAudioLinks();

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 Test Results: ${TESTS.passed} passed, ${TESTS.failed} failed\n`);

    if (TESTS.failed > 0) {
        console.error('❌ Some tests failed:');
        TESTS.errors.forEach(err => console.error(`  - ${err}`));
        process.exit(1);
    } else {
        console.log('✅ All tests passed!');
        process.exit(0);
    }
}

// Run tests
runTests().catch(err => {
    console.error('❌ Test runner error:', err);
    process.exit(1);
});
