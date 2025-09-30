// Placeholder API service for ProfileForm
const apiService = {
  generatePlan: async (data) => {
    console.log('API Service: generatePlan called with:', data);
    // Return a mock response for now
    return {
      success: true,
      data: {
        message: 'Plan generated successfully',
        topics: ['Math', 'Science', 'Reading'],
        schedule: 'Mock schedule data'
      }
    };
  }
};

export default apiService;
