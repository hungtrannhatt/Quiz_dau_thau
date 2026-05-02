const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mammoth = require('mammoth');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

// Configure Multer to store the uploaded file in memory
const upload = multer({ storage: multer.memoryStorage() });

// --- Helper Functions for Parsing ---

// Heuristic to detect if a line looks like a new question (e.g., "1.", "2.")
const isQuestionLine = (text) => /^\d+\.\s+/.test(text.trim());

// Heuristic to detect if a line looks like an option (e.g., "A.", "B.")
const isOptionLine = (text) => /^[A-D]\.\s+/.test(text.trim());

// Cleans the identifier (e.g., "A. ") from the start of the text
const getOptionDisplayText = (text) => text.trim().replace(/^[A-D]\.\s*/, '').trim();

// Function to calculate the sum of lengths of all text inside formatting tags
// Function to calculate the sum of lengths of all text inside formatting tags
const getFormattedTextLength = ($element) => {
    // Cheerio can extract and combine the text of all matching tags at once
    return $element.find('span.word-quiz-bold, strong, b, i, em, u').text().length;
};

// --- Main Parsing Logic ---

const parseHtmlToQuizJson = (rawHtml) => {
    const $ = cheerio.load(rawHtml);
    const allQuestions = [];
    let currentQuestion = null;
    let parsingState = 'IDLE'; // States: 'IDLE', 'QUESTION', 'OPTIONS'

    // We only care about top-level paragraph <p> elements
    $('p').each((index, element) => {
        const $p = $(element);
        const fullLineText = $p.text(); // Plain text content of the entire line
        
        // --- Detect New Question ---
        if (isQuestionLine(fullLineText)) {
            // 1. Save previous question (if it exists)
            if (currentQuestion && currentQuestion.questionText && currentQuestion.options.length > 0) {
                allQuestions.push(currentQuestion);
            }

            // 2. Initialize new question object
            currentQuestion = {
                // Keep the HTML formatting for display in the quiz UI
                questionText: $p.html().trim(), 
                options: []
            };
            parsingState = 'QUESTION';
            return; // Move to next line
        }

        // --- Detect Option Line ---
        if (parsingState === 'QUESTION' || parsingState === 'OPTIONS') {
            if (isOptionLine(fullLineText)) {
                parsingState = 'OPTIONS';

                if (!currentQuestion) return; // Should not happen if parsing a question first

                // --- KEY CHANGE: Heuristic for Correct Answer Differentiation ---
                // We compare the total length of ALL formatted text in this paragraph 
                // to the total text content of the entire paragraph.
                
                const totalFormattedLength = getFormattedTextLength($p);
                const isEntirelyBold = totalFormattedLength === fullLineText.length;

                currentQuestion.options.push({
                    text: getOptionDisplayText(fullLineText),
                    isCorrect: isEntirelyBold, // This line is only correct if the entire text is bold
                    // We save the plain text for the user, but the display will show HTML
                    displayText: fullLineText // For simplicity, we send the whole line for display
                });
                return;
            }
        }
        
        // --- Detect Non-Formatted Text (Handling multi-line questions) ---
        if (parsingState === 'QUESTION') {
             if (currentQuestion && fullLineText.trim()) {
                currentQuestion.questionText += `<br>${$p.html().trim()}`;
             }
        }
    });

    // Push the final question
    if (currentQuestion && currentQuestion.questionText && currentQuestion.options.length > 0) {
        allQuestions.push(currentQuestion);
    }

    return allQuestions.filter(q => q.options.length > 0); // Remove questions without options
};


// --- The Upload Endpoint ---
app.post('/api/upload-quiz', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Step 1: Convert Word Buffer to HTML using a custom style map
        const mammothOptions = {
            buffer: req.file.buffer,
            // Map the Word 'Bold' style to a custom span class for easier Cheerio matching
            styleMap: [
                "b => span.word-quiz-bold",
                "strong => span.word-quiz-bold"
            ]
        };
        const result = await mammoth.convertToHtml(mammothOptions);
        const rawHtml = result.value; 

        // Step 2: Use Cheerio to parse HTML into JSON
        const quizData = parseHtmlToQuizJson(rawHtml);

        res.json({ 
            success: true, 
            message: 'File processed and quiz generated.',
            data: quizData // This is your structured quiz JSON
        });

    } catch (error) {
        console.error('Error processing document:', error);
        res.status(500).json({ error: 'Failed to process the Word document' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Quiz API running on http://localhost:${PORT}`);
});