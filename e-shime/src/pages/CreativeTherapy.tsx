import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, BookOpen, Share2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { API_BASE } from '../lib/config';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Interfaces
interface CreativeTherapyProps {
  darkMode: boolean;
}

interface Art {
  id: number;
  title: string;
  description: string;
  link?: string;
  created_at?: string;
}

interface Poetry {
  id: number;
  author: string;
  title: string;
  excerpt: string;
  type: 'text' | 'audio' | 'video';
  date: string;
}

let update = false;

/* -------------------------------------------------------------------------- */
/*                            DIALOG FOR ADDING DATA                           */
/* -------------------------------------------------------------------------- */

function ActivityDialog({
  darkMode,
  type,
}: {
  darkMode: boolean;
  type: 'art' | 'poetry';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // POST ART (3 Inputs)
  const postArt = async (title: string, content: string, media_url: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/art/postArt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, media_url }),
      });

      if (!response.ok) {
        console.error("Art post failed:", await response.text());
        return false;
      }
      return true;
      
    } catch (err) {
      console.error("Error posting art:", err);
      return false;
    }
  };

  // POST POETRY (2 Inputs)
  const postPoetry = async (title: string, content: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/poetry/postPoetry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        console.error("Poetry post failed:", await response.text());
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error posting poetry:", err);
      return false;
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = async () => {
    if (!title || !content) return;

    setIsSubmitting(true);

    let success = false;

    if (type === "art") {
      success = await postArt(title, content, mediaUrl);
    } else if (type === "poetry") {
      success = await postPoetry(title, content);
    }

    if (success) {
      setTitle('');
      setContent('');
      setMediaUrl('');
      setIsOpen(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={darkMode ? 'bg-beige text-black' : 'bg-black text-white'}>
          <Share2 className="h-4 w-4 mr-2" /> + Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </DialogTrigger>

      <DialogContent className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} max-w-2xl`}>
        <DialogHeader>
          <DialogTitle className={darkMode ? 'text-white' : 'text-black'}>
            Share Your {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          
          {/* Title */}
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {type} Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter your ${type} title`}
              className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}
            />
          </div>

          {/* Content */}
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your {type}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${type} here...`}
              rows={8}
              className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}
            />
          </div>

          {/* Media URL (only for art) */}
          {type === "art" && (
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Media URL (Photo / Video / Link)
              </label>
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/my-art.jpg"
                className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={!title || !content || isSubmitting} className="flex-1">
              {isSubmitting ? 'Sharing…' : `Share ${type}`}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN DISPLAY PAGE                              */
/* -------------------------------------------------------------------------- */

export function CreativeTherapy({ darkMode }: CreativeTherapyProps) {
  const [artActivities, setArtActivities] = useState<Art[]>([]);
  const [poetryStories, setPoetryStories] = useState<Poetry[]>([]);

  useEffect(() => {
    // Fetch Art
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/art/getArt`, {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        const formattedArt = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.content,
          link: item.link,
          created_at: new Date(item.created_at).toLocaleDateString(
            'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' }
          )
        }));

        setArtActivities(formattedArt);
      } catch (err) {
        console.error("Error fetching art data:", err);
      }
    })();

    // Fetch Poetry
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/poetry/getPoetry`, {
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        const formattedPoetry = data.map((item: any) => ({
          id: item.id,
          author: item.author || "Anonymous",
          title: item.title,
          excerpt: item.content,
          type: item.type || "text",
          date: new Date(item.created_at).toLocaleDateString(
            'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' }
          )
        }));

        setPoetryStories(formattedPoetry);
      } catch (err) {
        console.error("Error fetching poetry data:", err);
      }
    })();
  }, []);

  /* UI Rendering (unchanged, just kept clean) */
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>Art & Creative Therapy</h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Explore healing through creative expression and cultural connection
            </p>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} overflow-hidden`}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8">
                <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>Why Creative Therapy?</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  Creative expression provides a powerful outlet for emotions that are difficult to express with words alone. Through art, music, dance, and storytelling, you can:
                </p>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Process complex emotions safely</li>
                  <li>• Connect with your cultural heritage</li>
                  <li>• Build self-awareness and confidence</li>
                  <li>• Find community and belonging</li>
                </ul>
              </div>
              <div className="relative h-64 md:h-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1751708692623-44fe44b6bcff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Creative expression"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <Tabs defaultValue="art" className="p-6">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="art"><Palette className="h-4 w-4" /> Art</TabsTrigger>
                <TabsTrigger value="poetry"><BookOpen className="h-4 w-4" /> Poetry</TabsTrigger>
              </TabsList>

              {/* ART TAB */}
              <TabsContent value="art">
                <ActivityDialog darkMode={darkMode} type="art" />
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {artActivities.map((a) => (
                    <Card key={a.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl`}>
                      <h4 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>{a.title}</h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{a.description}</p>
                      {a.link && (
                        <Button className="mt-4 w-full" onClick={() => window.open(a.link!)}>
                          View Media
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* POETRY TAB */}
              <TabsContent value="poetry">
                <ActivityDialog darkMode={darkMode} type="poetry" />
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {poetryStories.map((p) => (
                    <Card key={p.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6`}>
                      <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>{p.title}</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{p.author}</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{p.excerpt}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
