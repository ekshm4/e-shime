import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, ShieldCheck, Users, Smile } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from '../lib/config';

interface ChatProps {
  darkMode: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'therapist' | 'peer';
  time: string;
}

export function Chat({ darkMode }: ChatProps) {
  const [activeTab, setActiveTab] = useState('therapist');
  const [therapistChats, setTherapistChats] = useState<Message[]>([]);
  const [peerChats, setPeerChats] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const userId = localStorage.getItem('user_Id');
  const token = localStorage.getItem('token');

  /* --------------------------------------------------
     🔔 1. REQUEST NOTIFICATION PERMISSION
  -------------------------------------------------- */
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  /* --------------------------------------------------
     🔔 2. HELPER FUNCTION TO SHOW NOTIFICATION
  -------------------------------------------------- */
  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  // ------------------ TYPE-SAFE MESSAGE FETCHING ------------------
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/getMessages/messages`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data = await response.json();
        if (!data.success) return;

        const formattedMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.message_text,
          sender: msg.sender_id === Number(userId) ? 'user' : 'peer',
          time: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        }));

        setPeerChats(formattedMessages);
        console.log('Loaded peer messages:', formattedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/getTherapistMessages/therapistMessages`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              userid: userId || '',
            },
          }
        );

        const data = await response.json();
        if (!data.success) return;

        const formattedMessages: Message[] = data.messages.map((msg: any) => ({
          id: Date.now(),
          text: msg.message_text,
          sender: msg.sender_id === Number(userId) ? 'user' : 'therapist',
          time: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        }));

        setTherapistChats(formattedMessages);
        console.log('Loaded therapist messages:', formattedMessages);
      } catch (err) {
        console.error('Error fetching therapist messages:', err);
      }
    })();
  }, []);

  // ------------------ SOCKET.IO CONNECTION ------------------

  useEffect(() => {
    if (!token || !userId) return;

    const socket = io(API_BASE, {
      auth: { token },
    });

    socketRef.current = socket;

    const therapistRoom = `therapist-${userId}`;
    socket.emit('join-room', therapistRoom);

    // ------------------ THERAPIST ------------------
    socket.on('receive-therapist-messages', msg => {

      /* NEW: SHOW NOTIFICATION */
      showNotification("Therapist Message", msg.text);

      const message: Message = {
        id: msg.id,
        text: msg.text,
        sender: msg.sender === 'therapist' ? 'therapist' : 'user',
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };

      setTherapistChats(prev => [...prev, message]);
    });

    // ------------------ PEERS ------------------
    socket.on('receive-peer-messages', msg => {

      /* NEW: SHOW NOTIFICATION */
      showNotification("New Peer Message", msg.text);

      const message: Message = {
        id: msg.id,
        text: msg.text,
        sender: 'peer',
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      };

      setPeerChats(prev => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userId]);

  // ------------------ SEND MESSAGE ------------------
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    if (activeTab === 'therapist') {
      setTherapistChats([...therapistChats, message]);
      socketRef.current?.emit('send-therapist-message', {
        id: userId,
        text: newMessage,
        sender: 'user',
        room: `therapist-${userId}`,
      });
    } else {
      setPeerChats([...peerChats, message]);
      socketRef.current?.emit('send-peer-message', {
        id: userId,
        text: newMessage,
        sender: 'user',
      });
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessages = (messages: Message[]) =>
    messages.map((message, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        } mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
            message.sender === 'user'
              ? darkMode
                ? 'bg-beige text-black'
                : 'bg-black text-white'
              : darkMode
              ? 'bg-gray-700 text-white'
              : 'bg-gray-200 text-black'
          }`}
        >
          <p>{message.text}</p>
          <p
            className={`text-xs mt-1 ${
              message.sender === 'user'
                ? darkMode
                  ? 'text-gray-700'
                  : 'text-gray-300'
                : darkMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            {message.time}
          </p>
        </div>
      </motion.div>
    ));

  // ------------------ RENDER ------------------
  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'
      } transition-colors duration-300 pb-20`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Anonymous Chat
          </h1>
          <div
            className={`flex items-center gap-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
            <p>Anonymous Mode On - Your identity is protected</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            } overflow-hidden`}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div
                className={`border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } px-6 pt-6`}
              >
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger
                    value="therapist"
                    className="flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Therapist Chat
                  </TabsTrigger>
                  <TabsTrigger value="peer" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Peer Support
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Therapist Chat */}
              <TabsContent value="therapist" className="p-0 m-0">
                <div className="h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    {renderMessages(therapistChats)}
                  </div>
                  <div
                    className={`border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } p-4`}
                  >
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className={
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50'
                        }
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={newMessage.trim() === ''}
                        className={
                          darkMode
                            ? 'bg-beige text-black hover:bg-beige/90'
                            : 'bg-black text-white hover:bg-black/90'
                        }
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNewMessage(newMessage + ' 😊')}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Peer Support Chat */}
              <TabsContent value="peer" className="p-0 m-0">
                <div className="h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    {renderMessages(peerChats)}
                  </div>
                  <div
                    className={`border-t ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } p-4`}
                  >
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share your thoughts with the community..."
                        className={
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50'
                        }
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={newMessage.trim() === ''}
                        className={
                          darkMode
                            ? 'bg-beige text-black hover:bg-beige/90'
                            : 'bg-black text-white hover:bg-black/90'
                        }
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNewMessage(newMessage + ' 😊')}
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
