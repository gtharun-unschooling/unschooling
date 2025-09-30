// Script to check for duplicates in Play & Creativity data
const fs = require('fs');

console.log('🔍 Checking for duplicates in Play & Creativity data...');

// Read the data
const data = JSON.parse(fs.readFileSync('src/data/essential-growth/play-creativity/activities.json', 'utf8'));

// Check for duplicate topics within each category
let duplicates = [];
let totalActivities = 0;
let uniqueTopics = new Set();

console.log('\n📊 Data Structure Analysis:');
console.log(`- Age Groups: ${data.ageGroups.length}`);

data.ageGroups.forEach((ageGroup, ageIndex) => {
  console.log(`\n🎯 ${ageGroup.ageGroup}:`);
  console.log(`  - Categories: ${ageGroup.categories.length}`);
  
  ageGroup.categories.forEach((category, catIndex) => {
    console.log(`  📁 ${category.category}: ${category.activities.length} activities`);
    
    // Check for duplicate topics within this category
    const topicsInCategory = category.activities.map(activity => activity.topic);
    const uniqueTopicsInCategory = new Set(topicsInCategory);
    
    if (topicsInCategory.length !== uniqueTopicsInCategory.size) {
      console.log(`    ⚠️  DUPLICATE TOPICS FOUND in ${category.category}!`);
      const duplicatesInCategory = topicsInCategory.filter((topic, index) => 
        topicsInCategory.indexOf(topic) !== index
      );
      console.log(`    Duplicates: ${duplicatesInCategory.join(', ')}`);
      duplicates.push({
        ageGroup: ageGroup.ageGroup,
        category: category.category,
        duplicates: duplicatesInCategory
      });
    }
    
    // Check for duplicate topic numbers
    const topicNumbers = category.activities.map(activity => activity.topicNumber);
    const uniqueTopicNumbers = new Set(topicNumbers);
    
    if (topicNumbers.length !== uniqueTopicNumbers.size) {
      console.log(`    ⚠️  DUPLICATE TOPIC NUMBERS FOUND in ${category.category}!`);
      const duplicateNumbers = topicNumbers.filter((num, index) => 
        topicNumbers.indexOf(num) !== index
      );
      console.log(`    Duplicate numbers: ${duplicateNumbers.join(', ')}`);
    }
    
    // Add to global unique topics check
    category.activities.forEach(activity => {
      const topicKey = `${ageGroup.ageGroup}-${category.category}-${activity.topic}`;
      if (uniqueTopics.has(topicKey)) {
        console.log(`    ⚠️  GLOBAL DUPLICATE: ${activity.topic} in ${ageGroup.ageGroup} - ${category.category}`);
        duplicates.push({
          type: 'global',
          topic: activity.topic,
          ageGroup: ageGroup.ageGroup,
          category: category.category
        });
      } else {
        uniqueTopics.add(topicKey);
      }
    });
    
    totalActivities += category.activities.length;
  });
});

console.log(`\n📈 Summary:`);
console.log(`- Total Activities: ${totalActivities}`);
console.log(`- Unique Topic Keys: ${uniqueTopics.size}`);
console.log(`- Duplicates Found: ${duplicates.length}`);

if (duplicates.length === 0) {
  console.log('\n✅ NO DUPLICATES FOUND! Data is clean.');
} else {
  console.log('\n❌ DUPLICATES FOUND:');
  duplicates.forEach(dup => {
    if (dup.type === 'global') {
      console.log(`  - Global duplicate: "${dup.topic}" in ${dup.ageGroup} - ${dup.category}`);
    } else {
      console.log(`  - Category duplicates in ${dup.ageGroup} - ${dup.category}: ${dup.duplicates.join(', ')}`);
    }
  });
}

// Check data integrity
console.log('\n🔍 Data Integrity Check:');
let integrityIssues = [];

data.ageGroups.forEach((ageGroup, ageIndex) => {
  ageGroup.categories.forEach((category, catIndex) => {
    category.activities.forEach((activity, actIndex) => {
      // Check required fields
      const requiredFields = ['topicNumber', 'topic', 'objective', 'explanation', 'hashtags', 'estimatedTime', 'age', 'activity'];
      requiredFields.forEach(field => {
        if (!activity[field]) {
          integrityIssues.push(`Missing ${field} in ${ageGroup.ageGroup} - ${category.category} - ${activity.topic || 'Unknown'}`);
        }
      });
      
      // Check activity structure
      if (activity.activity) {
        const activityFields = ['name', 'materials', 'steps', 'skills'];
        activityFields.forEach(field => {
          if (!activity.activity[field]) {
            integrityIssues.push(`Missing activity.${field} in ${ageGroup.ageGroup} - ${category.category} - ${activity.topic}`);
          }
        });
      }
    });
  });
});

if (integrityIssues.length === 0) {
  console.log('✅ All required fields present - Data integrity is good!');
} else {
  console.log('❌ Data integrity issues found:');
  integrityIssues.forEach(issue => console.log(`  - ${issue}`));
}

console.log('\n🎯 Data Quality Summary:');
console.log(`- Age Groups: ${data.ageGroups.length} ✅`);
console.log(`- Total Activities: ${totalActivities} ✅`);
console.log(`- Duplicates: ${duplicates.length === 0 ? 'None ✅' : `${duplicates.length} found ❌`}`);
console.log(`- Data Integrity: ${integrityIssues.length === 0 ? 'Good ✅' : `${integrityIssues.length} issues ❌`}`);
