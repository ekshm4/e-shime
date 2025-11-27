import pool from '../config/database.js';

/**
 * Create a new story
 */
export const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const [result] = await pool.execute(
      `INSERT INTO stories (title, content) VALUES (?, ?)`,
      [title, content]
    );

    console.log(result.insertId);
    res.status(201).json({
      message: "Story created successfully",
      storyId: result.insertId,
    });

    
  } catch (error) {
    console.error("Error inserting story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get all stories
export const getAllStories = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, title, content, created_at 
       FROM stories
       ORDER BY created_at DESC`
    );

    console.log(rows);
    res.status(200).json(rows);

  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Get story by ID
 */

// Backwards-compatible default export
const Story = {
  create: createStory,
  getAll: getAllStories,

};

export default Story;
