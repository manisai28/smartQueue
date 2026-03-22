import queueService from '../services/queueService.js';

// Customer: Join Queue
export const joinQueue = async (req, res) => {
  try {
    const { serviceId, userId, userName } = req.body;
    
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required',
      });
    }
    
    const result = await queueService.joinQueue(serviceId, userId, userName);
    
    res.json({
      success: true,
      message: 'Joined queue successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer: Track Queue
export const trackQueue = async (req, res) => {
  try {
    const { serviceId, token } = req.params;
    
    const result = await queueService.trackQueue(parseInt(serviceId), token);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer: Get Queue Status
export const getQueueStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const result = await queueService.getQueueStatus(parseInt(serviceId));
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer: Get All Queues
export const getAllQueues = async (req, res) => {
  try {
    const queues = await queueService.getAllQueues();
    
    res.json({
      success: true,
      data: queues,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Call Next Token
export const callNextToken = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const result = await queueService.callNextToken(parseInt(serviceId));
    
    res.json({
      success: true,
      message: 'Token called successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Toggle Counter
export const toggleCounter = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { open } = req.body;
    
    const result = await queueService.toggleCounter(parseInt(serviceId), open);
    
    res.json({
      success: true,
      message: `Counter ${result.status}`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Remove Token
export const removeToken = async (req, res) => {
  try {
    const { serviceId, token } = req.params;
    
    await queueService.removeToken(parseInt(serviceId), token);
    
    res.json({
      success: true,
      message: 'Token removed successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await queueService.getDashboardStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};