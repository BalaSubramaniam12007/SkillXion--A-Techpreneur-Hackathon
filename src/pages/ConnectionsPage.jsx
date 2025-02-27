import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Typography, 
  Chip,
  Divider,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Container,
  Pagination
} from '@mui/material';
import { 
  PersonRemove, 
  Message, 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  PersonAdd
} from '@mui/icons-material';
import Header from './Header'; // Adjust the import path as needed

// Sample data for Connections (10 items)
const sampleConnections = Array.from({ length: 10 }, (_, index) => ({
  id: `conn-${index + 1}`,
  connection_id: `user-${index + 1}`,
  status: 'accepted',
  connected_since: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  mutual_connections: Math.floor(Math.random() * 20),
  profiles: {
    username: `user${index + 1}`,
    full_name: `User ${index + 1}`,
    avatar_url: `https://i.pravatar.cc/150?img=${index + 1}`,
    job_title: ['Designer', 'Developer', 'Product Manager', 'Marketing', 'CEO', 'Engineer', 'Analyst', 'Consultant', 'Founder', 'Writer'][index % 10],
    company: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Tesla', 'Netflix', 'Spotify', 'Airbnb', 'Slack'][index % 10],
    location: ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Austin', 'Paris', 'Sydney', 'Toronto', 'Seattle'][index % 10],
  },
}));

// Sample data for "People You May Know" (10 items)
const sampleSuggestions = Array.from({ length: 10 }, (_, index) => ({
  id: `sugg-${index + 1}`,
  user_id: `user-sugg-${index + 1}`,
  profiles: {
    username: `sugg${index + 1}`,
    full_name: `Suggested User ${index + 1}`,
    avatar_url: `https://i.pravatar.cc/150?img=${index + 11}`,
    job_title: ['Engineer', 'Artist', 'Analyst', 'Consultant', 'Founder', 'Writer', 'Designer', 'Developer', 'Manager', 'Strategist'][index % 10],
    company: ['Tesla', 'Netflix', 'Spotify', 'Airbnb', 'Slack', 'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'][index % 10],
    location: ['Austin', 'Paris', 'Sydney', 'Toronto', 'Seattle', 'San Francisco', 'New York', 'London', 'Berlin', 'Tokyo'][index % 10],
    mutual_connections: Math.floor(Math.random() * 10),
  },
}));

const ConnectionsPage = () => {
  const [connections] = useState(sampleConnections);
  const [suggestions] = useState(sampleSuggestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Pagination states
  const [connPage, setConnPage] = useState(1);
  const [suggPage, setSuggPage] = useState(1);
  const itemsPerPage = 3; // Show 3 items per page

  const handleDisconnect = (connectionId) => {
    console.log(`Disconnected ${connectionId}`);
  };

  const handleConnect = (suggestionId) => {
    console.log(`Connection request sent to ${suggestionId}`);
  };

  const filteredConnections = connections.filter(conn => 
    conn.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.profiles.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.profiles.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.profiles.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.profiles.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Pagination logic
  const connPageCount = Math.ceil(filteredConnections.length / itemsPerPage);
  const suggPageCount = Math.ceil(suggestions.length / itemsPerPage);
  
  const paginatedConnections = filteredConnections.slice(
    (connPage - 1) * itemsPerPage,
    connPage * itemsPerPage
  );
  
  const paginatedSuggestions = suggestions.slice(
    (suggPage - 1) * itemsPerPage,
    suggPage * itemsPerPage
  );

  return (
    <>
      <Header isForDashboard={true} />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0A66C2', mb: 2 }}>
            My Network
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={`${filteredConnections.length} Connections`} 
              sx={{ bgcolor: '#E9ECEF', fontWeight: 'medium' }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Search your connections"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton sx={{ bgcolor: 'white', border: '1px solid #E0E0E0' }} onClick={() => setFilterOpen(!filterOpen)}>
                <FilterIcon sx={{ color: '#0A66C2' }} />
              </IconButton>
              <IconButton sx={{ bgcolor: 'white', border: '1px solid #E0E0E0' }}>
                <SortIcon sx={{ color: '#0A66C2' }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Filter Section */}
        {filterOpen && (
          <Card sx={{ mb: 4, bgcolor: '#F7FAFC', boxShadow: 'none', border: '1px solid #E0E0E0' }}>
            <CardContent sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="All Connections" color="primary" clickable />
              <Chip label="Recent" variant="outlined" clickable sx={{ borderColor: '#0A66C2', color: '#0A66C2' }} />
              <Chip label="Company: Google" variant="outlined" clickable sx={{ borderColor: '#0A66C2', color: '#0A66C2' }} />
            </CardContent>
          </Card>
        )}

        {/* Connections Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 4 }}>
          {paginatedConnections.length === 0 ? (
            <Typography sx={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', py: 4 }}>
              {searchQuery ? 'No connections match your search.' : 'You haven’t added any connections yet.'}
            </Typography>
          ) : (
            paginatedConnections.map((conn) => (
              <Card 
                key={conn.id} 
                sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2, bgcolor: 'white' }}
              >
                <Box sx={{ height: 60, bgcolor: '#E9ECEF' }} />
                <CardContent sx={{ pt: 4, pb: 2, position: 'relative' }}>
                  <Avatar
                    src={conn.profiles.avatar_url}
                    sx={{ width: 80, height: 80, border: '2px solid white', position: 'absolute', top: '-40px', left: 16 }}
                  />
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {conn.profiles.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {conn.profiles.job_title} at {conn.profiles.company}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
                      {conn.profiles.location} • Connected {formatDate(conn.connected_since)}
                    </Typography>
                    <Chip 
                      label={`${conn.mutual_connections} mutual connections`} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mt: 1, borderColor: '#E0E0E0', color: '#666' }}
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ bgcolor: '#F7FAFC', justifyContent: 'space-between', p: 1 }}>
                  <Button startIcon={<Message />} sx={{ color: '#0A66C2', textTransform: 'none' }}>
                    Message
                  </Button>
                  <Button
                    startIcon={<PersonRemove />}
                    onClick={() => handleDisconnect(conn.connection_id)}
                    sx={{ color: '#666', textTransform: 'none' }}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>

        {/* Connections Pagination */}
        {connPageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={connPageCount} 
              page={connPage} 
              onChange={(e, page) => setConnPage(page)} 
              color="primary" 
            />
          </Box>
        )}

        {/* People You May Know Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0A66C2', mb: 3 }}>
            People You May Know
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 4 }}>
            {paginatedSuggestions.map((sugg) => (
              <Card key={sugg.id} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2, bgcolor: 'white' }}>
                <Box sx={{ height: 60, bgcolor: '#E9ECEF' }} />
                <CardContent sx={{ pt: 4, pb: 2, position: 'relative' }}>
                  <Avatar
                    src={sugg.profiles.avatar_url}
                    sx={{ width: 80, height: 80, border: '2px solid white', position: 'absolute', top: '-40px', left: 16 }}
                  />
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {sugg.profiles.full_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {sugg.profiles.job_title} at {sugg.profiles.company}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.85rem' }}>
                      {sugg.profiles.location}
                    </Typography>
                    <Chip 
                      label={`${sugg.profiles.mutual_connections} mutual connections`} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mt: 1, borderColor: '#E0E0E0', color: '#666' }}
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ bgcolor: '#F7FAFC', justifyContent: 'center', p: 1 }}>
                  <Button
                    startIcon={<PersonAdd />}
                    onClick={() => handleConnect(sugg.user_id)}
                    sx={{ color: '#0A66C2', textTransform: 'none' }}
                  >
                    Connect
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Suggestions Pagination */}
          {suggPageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={suggPageCount} 
                page={suggPage} 
                onChange={(e, page) => setSuggPage(page)} 
                color="primary" 
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ConnectionsPage;