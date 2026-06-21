// StoryService.js
// Tầng service cho Story: xử lý business logic giữa controller và model
// bao gồm xóa file ảnh cũ khi update/delete

const Story = require('../models/Story');
const fs = require('fs');
const path = require('path');

const StoryService = {
  async getAllStories(options) {
    return await Story.getAllStories(options);
  },

  async getStoryDetailForUser(storyid) {
    return await Story.getForUser(storyid);
  },

  async getStoryDetailForAdmin(storyid) {
    return await Story.getDetailForAdmin(storyid);
  },

  async createStory(storyData, categoryIDs) {
    return await Story.create(storyData, categoryIDs);
  },

  async updateStory(storyid, storyData, categoryIDs) {
    if (storyData.image) {
      const oldStory = await Story.getDetailForAdmin(storyid);
      if (oldStory?.image) {
        const oldPath = path.join(__dirname, '../../', oldStory.image);
        if (fs.existsSync(oldPath)) fs.unlink(oldPath, (err) => { if (err) console.log(err); });
      }
    }
    return await Story.update(storyid, storyData, categoryIDs);
  },

  async deleteStory(storyid) {
    const story = await Story.getDetailForAdmin(storyid);
    if (story?.image) {
      const imgPath = path.join(__dirname, '../../', story.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    return await Story.remove(storyid);
  },

  async searchStories(query) {
    return await Story.search(query);
  },

  async getRelatedStories(storyid) {
    return await Story.getRelated(storyid);
  },

  async toggleStoryVisibility(storyid) {
    await Story.toggleVisibility(storyid);
    return await Story.getAllStories({ visibleOnly: false });
  }
};

module.exports = StoryService;