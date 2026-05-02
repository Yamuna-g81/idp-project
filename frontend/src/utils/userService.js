// User Service for managing multiple users
export const userService = {
  // Get all registered users
  getAllUsers() {
    return JSON.parse(localStorage.getItem("allUsers") || "[]");
  },

  // Add a new user to the database
  addUser(userData) {
    const users = this.getAllUsers();
    
    // Check if user with same student ID or email already exists
    const existingUser = users.find(user => 
      user.studentId === userData.studentId || user.email === userData.email
    );
    
    if (existingUser) {
      throw new Error("User with this Student ID or Email already exists");
    }
    
    users.push(userData);
    localStorage.setItem("allUsers", JSON.stringify(users));
    return userData;
  },

  // Find user by student ID or email
  findUser(identifier) {
    const users = this.getAllUsers();
    return users.find(user => 
      user.studentId === identifier || user.email === identifier
    );
  },

  // Authenticate user (check credentials)
  authenticateUser(identifier, password) {
    const user = this.findUser(identifier);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    
    if (user.password !== password) {
      return { success: false, message: "Invalid password" };
    }
    
    return { success: true, user: user };
  },

  // Update user data
  updateUser(userData) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => 
      user.studentId === userData.studentId || user.email === userData.email
    );
    
    if (index !== -1) {
      users[index] = userData;
      localStorage.setItem("allUsers", JSON.stringify(users));
      return userData;
    }
    
    throw new Error("User not found");
  },

  // Clear all users (for testing)
  clearAllUsers() {
    localStorage.removeItem("allUsers");
  }
};
