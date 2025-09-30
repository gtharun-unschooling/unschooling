import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Popover, 
  Typography, 
  Button, 
  TextField,
  Divider 
} from '@mui/material';
import { 
  Share, 
  Facebook, 
  Twitter, 
  LinkedIn, 
  WhatsApp, 
  Email, 
  Link as LinkIcon,
  ContentCopy 
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SocialShare = ({ 
  url = window.location.href,
  title = "Check out Unschooling React - Personalized Learning Platform",
  description = "AI-powered personalized learning plans for children. Discover our Nurture, Grow, and Thrive plans.",
  hashtags = ["unschooling", "education", "children", "learning"]
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [customMessage, setCustomMessage] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    handleClose();
  };

  const handleCustomShare = () => {
    const message = customMessage || `${title} - ${url}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: message,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Message copied to clipboard!');
    }
    handleClose();
  };

  const ShareButton = ({ platform, icon: Icon, color, label }) => (
    <Button
      variant="outlined"
      startIcon={<Icon />}
      onClick={() => handleShare(platform)}
      sx={{ 
        mb: 1, 
        width: '100%',
        justifyContent: 'flex-start',
        color: color,
        borderColor: color,
        '&:hover': {
          backgroundColor: `${color}10`,
          borderColor: color
        }
      }}
    >
      {label}
    </Button>
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ 
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white'
          }
        }}
        aria-label="share"
      >
        <Share />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2, minWidth: 250 }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Share this page
        </Typography>

        <Box sx={{ mb: 2 }}>
          <ShareButton
            platform="facebook"
            icon={Facebook}
            color="#1877F2"
            label="Share on Facebook"
          />
          <ShareButton
            platform="twitter"
            icon={Twitter}
            color="#1DA1F2"
            label="Share on Twitter"
          />
          <ShareButton
            platform="linkedin"
            icon={LinkedIn}
            color="#0077B5"
            label="Share on LinkedIn"
          />
          <ShareButton
            platform="whatsapp"
            icon={WhatsApp}
            color="#25D366"
            label="Share on WhatsApp"
          />
          <ShareButton
            platform="email"
            icon={Email}
            color="#EA4335"
            label="Share via Email"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <ShareButton
            platform="copy"
            icon={LinkIcon}
            color="#666"
            label="Copy Link"
          />
        </Box>

        {navigator.share && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Custom message:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add your message..."
              size="small"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleCustomShare}
              fullWidth
              startIcon={<Share />}
            >
              Share with Custom Message
            </Button>
          </>
        )}
      </Popover>
    </>
  );
};

export default SocialShare;
