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
  if (!milestones || milestones.length === 0) {
    return 0;
  }
  
  let completionPercentage = 0;
  
  milestones.forEach(milestone => {
    // If the milestone is completed, add its weight to the completion percentage
    if (milestone.status === 'Completed') {
      // Get the milestone weight by name or use default weight
      const weight = MILESTONE_WEIGHTS[milestone.name] || 0;
      completionPercentage += weight;
    }
  });
  
  // Ensure the completion percentage doesn't exceed 100
  return Math.min(completionPercentage, 100);
}

module.exports = {
  MILESTONE_WEIGHTS,
  calculateProjectCompletion
};
