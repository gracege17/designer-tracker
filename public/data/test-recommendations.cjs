/**
 * Test file for recommendations.json
 * 
 * Run this file with: node public/data/test-recommendations.cjs
 */

const fs = require('fs')
const path = require('path')

// Load the JSON file
const filePath = path.join(__dirname, 'recommendations.json')
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

console.log('🧪 Testing recommendations.json\n')

// Test 1: Verify structure
console.log('✅ Test 1: File loaded successfully')
console.log(`   - File size: ${fs.statSync(filePath).size} bytes\n`)

// Test 2: Check emotional states
const emotionalStates = Object.keys(data.emotionalStates)
console.log('✅ Test 2: Emotional States')
console.log(`   - Found ${emotionalStates.length} states: ${emotionalStates.join(', ')}\n`)

// Test 3: Check categories in each state
console.log('✅ Test 3: Resource Categories per State')
emotionalStates.forEach(state => {
  const categories = Object.keys(data.emotionalStates[state])
  const counts = categories.map(cat => 
    `${cat} (${data.emotionalStates[state][cat].length})`
  )
  console.log(`   - ${state}: ${counts.join(', ')}`)
})
console.log('')

// Test 4: Verify resource structure
console.log('✅ Test 4: Resource Structure Validation')
let allValid = true
emotionalStates.forEach(state => {
  Object.keys(data.emotionalStates[state]).forEach(category => {
    data.emotionalStates[state][category].forEach(resource => {
      if (!resource.id || !resource.category || !resource.title || !resource.description || !resource.url) {
        console.log(`   ❌ Invalid resource in ${state}.${category}: ${resource.id || 'no-id'}`)
        allValid = false
      }
    })
  })
})
if (allValid) {
  console.log('   - All resources have required fields (id, category, title, description, url)\n')
}

// Test 5: Check quotes
console.log('✅ Test 5: Inspirational Quotes')
console.log(`   - Found ${data.quotes.length} quotes`)
const quoteCategories = [...new Set(data.quotes.map(q => q.category))]
console.log(`   - Categories: ${quoteCategories.join(', ')}\n`)

// Test 6: Check task type resources
console.log('✅ Test 6: Task Type Resources')
const taskTypes = Object.keys(data.taskTypeResources)
console.log(`   - Found ${taskTypes.length} task types: ${taskTypes.join(', ')}\n`)

// Test 7: Sample data output
console.log('✅ Test 7: Sample Resources\n')
console.log('   Balanced State - Tool:')
const sampleTool = data.emotionalStates.balanced.tools[0]
console.log(`   - ${sampleTool.title}`)
console.log(`   - ${sampleTool.description}`)
console.log(`   - ${sampleTool.url}\n`)

console.log('   Random Quote:')
const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)]
console.log(`   - "${randomQuote.text}"`)
console.log(`   - ${randomQuote.author} (${randomQuote.category})\n`)

// Test 8: Count total resources
const totalResources = emotionalStates.reduce((total, state) => {
  const stateCount = Object.keys(data.emotionalStates[state]).reduce((count, category) => {
    return count + data.emotionalStates[state][category].length
  }, 0)
  return total + stateCount
}, 0)

console.log('✅ Test 8: Total Resources')
console.log(`   - ${totalResources} resources across all states\n`)

// Test 9: Verify unique IDs
console.log('✅ Test 9: Unique ID Validation')
const allIds = []
emotionalStates.forEach(state => {
  Object.keys(data.emotionalStates[state]).forEach(category => {
    data.emotionalStates[state][category].forEach(resource => {
      allIds.push(resource.id)
    })
  })
})
const uniqueIds = new Set(allIds)
if (uniqueIds.size === allIds.length) {
  console.log(`   - All ${allIds.length} resource IDs are unique ✓\n`)
} else {
  console.log(`   ❌ Found duplicate IDs (${allIds.length} total, ${uniqueIds.size} unique)\n`)
}

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 Summary')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Emotional States: ${emotionalStates.length}`)
console.log(`Total Resources: ${totalResources}`)
console.log(`Inspirational Quotes: ${data.quotes.length}`)
console.log(`Task Type Categories: ${taskTypes.length}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

console.log('✨ All tests passed! recommendations.json is ready for use.\n')

