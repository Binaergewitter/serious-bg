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

    // Check for %20 in href attributes
    const hrefMatches = content.match(/href="[^"]*"/g) || [];
    const encodedSpaceLinks = hrefMatches.filter(href => href.includes('%20'));

    assert(
        encodedSpaceLinks.length === 0,
        `No navigation links contain %20 encoding (found ${encodedSpaceLinks.length})`
    );

    if (encodedSpaceLinks.length > 0) {
        console.log('  Links with %20:', encodedSpaceLinks.slice(0, 5));
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

// Test 6: All articles have required front matter
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
