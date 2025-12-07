# Seeding Instructions for Engagement Questions

## To seed engagement questions into your database:

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Make sure your `.env` file has the correct `MONGO_URI` set up**

3. **Run the seed script:**
   ```bash
   node seedEngagementQuestions.js
   ```

4. **You should see output like:**
   ```
   ✅ Connected to MongoDB
   ✅ Cleared existing engagement questions
   ✅ Seeded 40 engagement questions successfully
   ```

5. **Verify the questions are in the database:**
   - Check your MongoDB database
   - Or visit the Engagement page on your frontend

## If you get errors:

- Make sure MongoDB is running and accessible
- Check that `MONGO_URI` in your `.env` file is correct
- Ensure you have the necessary npm packages installed (`mongoose`, `dotenv`)

## Note:

The seed script will:
- Clear all existing engagement questions
- Insert 40 new questions (13 Aptitude, 13 Reasoning, 14 Coding)

