import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar 
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';

// Dummy message history data (for demonstration)
const generateDummyMessages = (recipientName) => [
  { id: 1, sender: 'You', text: `Hey ${recipientName}, how’s it going?`, timestamp: '2025-02-26T10:00:00Z' },
  { id: 2, sender: recipientName, text: 'Hey! Pretty good, thanks for asking!', timestamp: '2025-02-26T10:05:00Z' },
  { id: 3, sender: 'You', text: 'Cool, got any plans this weekend?', timestamp: '2025-02-26T10:10:00Z' },
];

const MessageModal = ({ open, onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(recipient ? generateDummyMessages(recipient.full_name) : []);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: message,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setMessage(''); // Clear input
      console.log(`Sent to ${recipient.full_name}: ${message}`);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          height: '70vh',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: '#0A66C2', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={recipient?.avatar_url} sx={{ width: 40, height: 40, border: '2px solid white' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {recipient?.full_name || 'Recipient'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Message History */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2, 
            bgcolor: '#F7FAFC' 
          }}
        >
          <List>
            {messages.map((msg) => (
              <ListItem 
                key={msg.id} 
                sx={{ 
                  flexDirection: msg.sender === 'You' ? 'row-reverse' : 'row', 
                  gap: 1, 
                  px: 0 
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={msg.sender === 'You' ? null : recipient?.avatar_url} 
                    sx={{ width: 30, height: 30 }}
                  >
                    {msg.sender === 'You' ? 'Y' : null}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box 
                      sx={{ 
                        bgcolor: msg.sender === 'You' ? '#0A66C2' : '#E9ECEF', 
                        color: msg.sender === 'You' ? 'white' : '#333', 
                        p: 1, 
                        borderRadius: 2, 
                        maxWidth: '70%', 
                        wordBreak: 'break-word' 
                      }}
                    >
                      {msg.text}
                    </Box>
                  }
                  secondary={formatTimestamp(msg.timestamp)}
                  secondaryTypographyProps={{ 
                    sx: { color: '#999', fontSize: '0.75rem', textAlign: msg.sender === 'You' ? 'right' : 'left' } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Message Input */}
        <Divider />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            placeholder={`Message ${recipient?.full_name || 'them'}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            size="small"
            multiline
            maxRows={3}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!message.trim()}
            sx={{ bgcolor: '#0A66C2', textTransform: 'none', '&:hover': { bgcolor: '#004182' } }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MessageModal;