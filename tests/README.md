# Hugo Site Tests

Automated tests for the Binärgewitter Hugo site to ensure quality and prevent regressions.

## Running Tests

```bash
# Build the site first
hugo --minify

# Run all tests
node tests/test.js
```

## What's Tested

### ✅ Search Index Validation
- Valid JSON format (`searchindex.json`)
- Contains all expected entries (full keys: title, permalink, content)
- German language support and field boosting verified
- Includes known content (e.g., Talk #356)

### ✅ RSS Feed Validation
- All 16 feed combinations exist
- Valid XML structure
- Contains required podcast elements
- Audio URLs are present

### ✅ Audio Link Validation
- Sample audio files are accessible
- HTTP status checks for recent episodes
- Verifies download.binaergewitter.de availability

### ✅ Critical Pages
- Homepage exists
- Archives page exists
- Static pages (Abonnieren, Über uns, Impressum)

### ✅ Front Matter Validation
- All articles have required fields
- Title and date are present
- No malformed front matter

### ✅ Search Index Compression
- Gzipped version exists (in Docker builds)
- Compression ratio validation

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every push to main (before deployment)

See `.github/workflows/main.yml` for the full CI/CD pipeline.

## Test Output

```
🧪 Running Hugo Site Tests

📋 Testing search index...
✅ Search index is an array
✅ Search index contains 395 entries
...

📊 Test Results: 39 passed, 0 failed
✅ All tests passed!
```

## Adding New Tests

Edit `tests/test.js` and add new test functions following the pattern:

```javascript
function testMyFeature() {
  console.log('\n🔍 Testing my feature...');
  
  // Your test logic here
  assert(condition, 'Description of what passed');
}
```

Then call it in the `runTests()` function.
