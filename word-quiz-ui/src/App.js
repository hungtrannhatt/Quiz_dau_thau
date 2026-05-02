import React, { useState } from 'react';
import axios from 'axios';

// --- Utility Functions ---
// Shuffles an array randomly (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Chunks a large array into smaller arrays of a specific size
const chunkArray = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

function App() {
  const [currentStep, setCurrentStep] = useState('UPLOAD'); // UPLOAD, MENU, QUIZ, RESULT
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [mockTests, setMockTests] = useState([]); // Array of arrays (13 tests of 30)
  const [currentTestQuestions, setCurrentTestQuestions] = useState([]); // The 30 questions for the active test
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  
  // Immediate Feedback State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // --- 1. Handle File Upload & Chunking ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    setLoading(true);
    try {
      // Nếu bạn dùng Create React App:
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const response = await axios.post(`${apiUrl}/api/upload-quiz`, formData);
      const allQuestions = response.data.data;
      
      // Divide into chunks of 30
      const chunks = chunkArray(allQuestions, 30);
      setMockTests(chunks);
      setCurrentStep('MENU');
    } catch (error) {
      alert("Error uploading file. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Start a Specific Mock Test ---
  const startTest = (testIndex) => {
    // Get the selected test and shuffle its questions
    const selectedTest = mockTests[testIndex];
    const randomizedQuestions = shuffleArray(selectedTest);
    
    // Reset Quiz State
    setCurrentTestQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIncorrectAnswers([]);
    setSelectedOption(null);
    setIsRevealed(false);
    setCurrentStep('QUIZ');
  };

  // --- 3. Handle Answer Selection (Immediate Feedback) ---
  const handleOptionClick = (option) => {
    if (isRevealed) return; // Prevent changing answer after reveal
    setSelectedOption(option);
    setIsRevealed(true);
  };

  // --- 4. Move to Next Question ---
  const handleNextQuestion = () => {
    const currentQ = currentTestQuestions[currentIndex];
    
    // Track score and incorrect answers
    if (selectedOption.isCorrect) {
      setScore(score + 1);
    } else {
      const correctOpt = currentQ.options.find(o => o.isCorrect);
      setIncorrectAnswers(prev => [...prev, {
        questionText: currentQ.questionText,
        userAnswer: selectedOption.displayText || selectedOption.text,
        correctAnswer: correctOpt ? (correctOpt.displayText || correctOpt.text) : "Unknown"
      }]);
    }

    // Move to next or finish
    if (currentIndex + 1 < currentTestQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      setCurrentStep('RESULT');
    }
  };

  // --- UI Component: Upload Screen ---
  if (currentStep === 'UPLOAD') {
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 border-t-8 border-t-[#673ab7]">
          <h1 className="text-3xl font-normal text-gray-800 mb-2">Upload Exam Bank</h1>
          <p className="text-gray-600 mb-8 border-b border-gray-200 pb-4">Select your Word document containing the questions.</p>
          
          <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-[#1a73e8] font-medium py-2 px-6 rounded transition-colors inline-block">
            {loading ? "Processing File..." : "Add file"}
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".docx" disabled={loading} />
          </label>
        </div>
      </div>
    );
  }

  // --- UI Component: Mock Test Menu ---
  if (currentStep === 'MENU') {
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center p-6 py-12">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-lg shadow-md p-8 border-t-8 border-t-[#673ab7] mb-6">
            <h1 className="text-3xl font-normal text-gray-800 mb-2">Available Mock Tests</h1>
            <p className="text-gray-600">Total Questions Parsed: {mockTests.reduce((acc, curr) => acc + curr.length, 0)}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTests.map((test, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-xl text-gray-800 mb-2">Mock Test {index + 1}</h3>
                <p className="text-sm text-gray-500 mb-4">{test.length} Questions (Randomized)</p>
                <button 
                  onClick={() => startTest(index)}
                  className="text-[#1a73e8] font-medium hover:underline"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- UI Component: Quiz Player (Google Forms Style) ---
  if (currentStep === 'QUIZ') {
    const q = currentTestQuestions[currentIndex];
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center py-12 p-4">
        <div className="max-w-3xl w-full">
          
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-t-8 border-t-[#673ab7] mb-4">
            <h1 className="text-2xl font-normal text-gray-800">Mock Test Active</h1>
            <p className="text-sm text-red-600 mt-2">* Indicates required question</p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-base text-gray-800" dangerouslySetInnerHTML={{ __html: `${currentIndex + 1}. ${q.questionText}` }}></h2>
              <span className="text-red-500 text-xl ml-2">*</span>
            </div>

            <div className="space-y-4">
              {q.options.map((opt, i) => {
                // Determine styling based on reveal state
                let optionClass = "flex items-center p-3 rounded-md border border-transparent transition-colors cursor-pointer ";
                
                if (!isRevealed) {
                  optionClass += "hover:bg-gray-50";
                } else {
                  if (opt === selectedOption) {
                    optionClass += opt.isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400";
                  } else if (opt.isCorrect) {
                    optionClass += "bg-green-50 border-green-300"; // Highlight correct answer if missed
                  }
                  optionClass += " cursor-default"; // Disable pointer events visually
                }

                return (
                  <div key={i} className={optionClass} onClick={() => handleOptionClick(opt)}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0
                      ${opt === selectedOption ? 'border-[#673ab7]' : 'border-gray-400'}
                      ${isRevealed && opt.isCorrect ? 'border-green-500 bg-green-500' : ''}
                      ${isRevealed && opt === selectedOption && !opt.isCorrect ? 'border-red-500 bg-red-500' : ''}
                    `}>
                      {opt === selectedOption && !isRevealed && <div className="w-2.5 h-2.5 rounded-full bg-[#673ab7]"></div>}
                      {isRevealed && opt.isCorrect && <span className="text-white text-xs">✓</span>}
                      {isRevealed && opt === selectedOption && !opt.isCorrect && <span className="text-white text-xs">✕</span>}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: opt.displayText || opt.text }}></span>
                  </div>
                );
              })}
            </div>

            {/* Immediate Feedback Messaging & Next Button */}
            {isRevealed && (
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className={`font-medium ${selectedOption.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedOption.isCorrect ? 'Correct!' : 'Incorrect.'}
                </span>
                <button 
                  onClick={handleNextQuestion}
                  className="bg-[#1a73e8] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
                >
                  {currentIndex + 1 === currentTestQuestions.length ? 'Finish Test' : 'Next'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-gray-500">Question {currentIndex + 1} of {currentTestQuestions.length}</span>
            <button onClick={() => setCurrentStep('MENU')} className="text-sm text-gray-500 hover:underline">Clear form & Exit</button>
          </div>
        </div>
      </div>
    );
  }

  // --- UI Component: Results Screen ---
  if (currentStep === 'RESULT') {
    return (
      <div className="min-h-screen bg-[#f0ebf8] flex flex-col items-center py-12 p-6">
        <div className="max-w-3xl w-full">
          
          {/* Score Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 border-t-8 border-t-[#673ab7] mb-6">
            <h1 className="text-3xl font-normal text-gray-800 mb-2">Test Completed</h1>
            <p className="text-gray-600 mb-6 border-b border-gray-200 pb-4">Your response has been recorded.</p>
            
            <div className="flex items-center justify-between">
              <div className="text-xl">
                Score: <span className="font-bold text-2xl">{score}</span> / {currentTestQuestions.length}
              </div>
              <button 
                onClick={() => setCurrentStep('MENU')}
                className="text-[#1a73e8] font-medium hover:underline"
              >
                Return to Menu
              </button>
            </div>
          </div>

          {/* Incorrect Answers Review */}
          {incorrectAnswers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 mb-4 px-2">Questions to Review</h2>
              {incorrectAnswers.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-red-500">
                   <h3 className="text-base text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: item.questionText }}></h3>
                   
                   <div className="bg-red-50 text-red-800 p-3 rounded mb-2 text-sm border border-red-100">
                     <strong>Your Answer:</strong> <span dangerouslySetInnerHTML={{ __html: item.userAnswer }}></span>
                   </div>
                   <div className="bg-green-50 text-green-800 p-3 rounded text-sm border border-green-100">
                     <strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: item.correctAnswer }}></span>
                   </div>
                </div>
              ))}
            </div>
          )}
          
          {incorrectAnswers.length === 0 && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
               Perfect score! Great job.
            </div>
          )}

        </div>
      </div>
    );
  }
}

export default App;