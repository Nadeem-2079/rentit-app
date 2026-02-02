// utils/chatStore.ts

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

export interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  messages: Message[]; // Now storing full history
  unread: number;
}

// Initial Mock Data
export const GlobalChats: ChatSession[] = [
  { 
    id: 'Sarah Jenkins', 
    name: 'Sarah Jenkins', 
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg', 
    unread: 0,
    messages: [
        { id: '1', text: "Hi! Is the calculus book still available?", sender: 'me', time: 'Yesterday' },
        { id: '2', text: "Yes it is!", sender: 'them', time: 'Yesterday' }
    ]
  },
];

// Function to add a new chat or get existing one
export const getOrCreateChatSession = (name: string) => {
  let session = GlobalChats.find(c => c.name === name);
  
  if (!session) {
    session = {
      id: name,
      name: name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      unread: 0,
      messages: [] // Start empty
    };
    GlobalChats.unshift(session);
  }
  
  return session;
};

// Function to add a message to history
export const addMessageToChat = (name: string, text: string, sender: 'me' | 'them') => {
  const session = getOrCreateChatSession(name);
  
  const newMessage: Message = {
    id: Date.now().toString(),
    text: text,
    sender: sender,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  session.messages.push(newMessage);
  
  // Move chat to top of list
  const index = GlobalChats.indexOf(session);
  if (index > -1) {
    GlobalChats.splice(index, 1);
    GlobalChats.unshift(session);
  }
};