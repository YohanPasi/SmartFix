const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  // Reference to the User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Profile information
  contactNumber: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  province: {
    type: String,
    trim: true,
    default: ''
  },
  district: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  postalCode: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  profilePicturePublicId: {
    type: String,
    default: ''
  },

  // Business hours
  businessHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '18:00'
    },
    days: [{
      type: String
    }]
  },

  // Services offered
  services: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      trim: true
    }
  }],

  // Qualifications and certifications
  qualifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      trim: true
    },
    issueDate: Date,
    expiryDate: Date,
    credentialId: String
  }],

  // Ratings and reviews
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Availability status
  isAvailable: {
    type: Boolean,
    default: true
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },

  // Session information
  sessions: [{
    token: {
      type: String,
      required: true
    },
    deviceInfo: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String,
      trim: true
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
serviceProviderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add a new session
serviceProviderSchema.methods.addSession = async function(sessionData) {
  // Remove expired sessions
  this.sessions = this.sessions.filter(session => session.expiresAt > Date.now());
  
  // Add new session
  this.sessions.push(sessionData);
  await this.save();
};

// Method to remove a session
serviceProviderSchema.methods.removeSession = async function(token) {
  this.sessions = this.sessions.filter(session => session.token !== token);
  await this.save();
};

// Method to check if a session is valid
serviceProviderSchema.methods.isValidSession = function(token) {
  try {
    // If no sessions exist, return true to allow session creation
    if (!this.sessions || this.sessions.length === 0) {
      return true;
    }

    const session = this.sessions.find(s => s.token === token);
    if (!session) return true; // Allow new session creation
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      this.removeSession(token);
      return true; // Allow new session creation
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return true; // Allow new session creation on error
  }
};

// Method to update session activity
serviceProviderSchema.methods.updateSessionActivity = async function(token) {
  try {
    const session = this.sessions.find(s => s.token === token);
    if (session) {
      session.lastActivity = Date.now();
      // Extend session expiration
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      await this.save();
    } else {
      // If session not found, create a new one
      const newSession = {
        token: token,
        deviceInfo: 'Unknown',
        ipAddress: 'Unknown',
        lastActivity: Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
      this.sessions.push(newSession);
      await this.save();
    }
  } catch (error) {
    console.error('Error updating session activity:', error);
    // Don't throw error, just log it
  }
};

// Method to get active sessions
serviceProviderSchema.methods.getActiveSessions = function() {
  return this.sessions.filter(session => session.expiresAt > Date.now());
};

// Method to clear all sessions
serviceProviderSchema.methods.clearAllSessions = async function() {
  this.sessions = [];
  await this.save();
};

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider; 