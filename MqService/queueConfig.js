module.exports = {
    queueConfigs: [
      {
        type: 'hot',
        queue: 'HOTWORKER',
        handler:'HotController.dequeue',
        description: '' 
      }, 
      { 
        type: 'cold',
        queue: 'COLDWORKER',
        handler:'ColdController.dequeue',
        description: '' 
      }, 
    ]
  }