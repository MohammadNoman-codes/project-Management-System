/**
 * Milestone weights for project completion percentage
 */
const MILESTONE_WEIGHTS = {
  'Stage 1 - Studies': 2,
  'Stage 2 - Initial Design': 8,
  'Stage 3 - Detailed Design': 20,
  'Stage 4 - Tender Document': 15,
  'Stage 5 - Tendering & Award': 10,
  'Stage 6 - Execution': 35,
  'Stage 7 - Maintenance & Defects Liability': 7,
  'Stage 8 - Contract Adjustments': 0,
  'Stage 9 - Closing': 3
};

/**
 * Calculate project completion percentage based on completed milestones
 * @param {Array} milestones - List of project milestones
 * @returns {number} - Completion percentage
 */
function calculateProjectCompletion(milestones) {
  console.log('Calculating project completion with milestones:', milestones);
  
  if (!milestones || milestones.length === 0) {
    console.log('No milestones found, returning 0% completion');
    return 0;
  }
  
  let completionPercentage = 0;
  let totalWeight = 0;
  
  // First, log all the milestone names and their weights
  console.log('Available milestone weights:');
  Object.entries(MILESTONE_WEIGHTS).forEach(([name, weight]) => {
    console.log(`${name}: ${weight}%`);
  });
  
  // Then calculate completion
  milestones.forEach(milestone => {
    const milestoneName = milestone.name;
    const weight = MILESTONE_WEIGHTS[milestoneName] || 0;
    totalWeight += weight;
    
    // If the milestone is completed, add its weight to the completion percentage
    if (milestone.status === 'Completed') {
      console.log(`Milestone "${milestoneName}" is completed, adding ${weight}% to completion`);
      completionPercentage += weight;
    } else {
      console.log(`Milestone "${milestoneName}" is not completed (status: ${milestone.status}), weight: ${weight}%`);
    }
  });
  
  console.log(`Total completion: ${completionPercentage}% out of ${totalWeight}% total weight`);
  
  // Ensure the completion percentage doesn't exceed 100
  return Math.min(completionPercentage, 100);
}

module.exports = {
  MILESTONE_WEIGHTS,
  calculateProjectCompletion
};
