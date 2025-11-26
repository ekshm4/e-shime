import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Share2, Heart, MessageCircle, Play } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { API_BASE } from '../lib/config';

interface PeerStoriesProps {
  darkMode: boolean;
}

interface Story {
  id: number;
  author: string;
  title: string;
  excerpt: string;
  date: string;
}

export function PeerStories({ darkMode }: PeerStoriesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState({ title: '', content: '' });

  // --------------------------------------------------
  // FETCH STORIES
  // --------------------------------------------------
  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/story/getStories`);
      const data = await res.json();

      const formatted = data.map((item: any) => ({
        id: item.id,
        author: item.anonymous_name || "Anonymous",
        title: item.title,
        excerpt: item.content,
        date: new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      }));

      setStories(formatted);
    } catch (err) {
      console.error("Failed to load stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // --------------------------------------------------
  // POST STORY
  // --------------------------------------------------
  const handleSubmitStory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/story/postStories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newStory.title,
          content: newStory.content,
        })
      });

      if (!res.ok) throw new Error("Failed to post story");

      // Refresh frontend
      fetchStories();

      // Reset dialog
      setIsDialogOpen(false);
      setNewStory({ title: '', content: '' });

    } catch (err) {
      console.error("Error posting story:", err);
    }
  };


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300 pb-20`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>Peer Stories</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Find strength and inspiration in shared experiences
              </p>
            </div>

            {/* Share Story Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className={darkMode ? 'bg-beige text-black hover:bg-beige/90' : 'bg-black text-white hover:bg-black/90'}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Story
                </Button>
              </DialogTrigger>
              <DialogContent className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} max-w-2xl`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : 'text-black'}>Share Your Story</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Story Title</label>
                    <Input
                      value={newStory.title}
                      onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      placeholder="Give your story a title"
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Story</label>
                    <Textarea
                      value={newStory.content}
                      onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                      placeholder="Share your journey..."
                      rows={8}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}
                    />
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Privacy Note:</strong> Your story is anonymous.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSubmitStory} disabled={!newStory.title || !newStory.content} className="flex-1">
                      Share Story
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, index) => (
            <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white hover:border-gray-300'} transition-all cursor-pointer h-full`}>
                <div className="p-6">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                        <span className="text-xl">🌟</span>
                      </div>
                      <div>
                        <p className={`${darkMode ? 'text-white' : 'text-black'}`}>{story.author}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{story.date}</p>
                      </div>
                    </div>

                  </div>

                  {/* Content */}
                  <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-3`}>{story.title}</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 line-clamp-3`}>{story.excerpt}</p>

                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
