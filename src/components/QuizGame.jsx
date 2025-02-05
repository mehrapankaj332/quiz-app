import React, { useState, useEffect } from "react";
import {
  POINTS_PER_LEVEL,
  quizData,
  REQUIRED_CORRECT_ANSWERS,
} from "../components/QuizGame/constants/index";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";

const QuizGame = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [gameState, setGameState] = useState("start");
  const [currentLevel, setCurrentLevel] = useState("easy");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reTryLevel, setReTryLevel] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (gameState === "playing") {
      setQuestions(shuffleQuestions(quizData[currentLevel]));
      setTimerActive(true);
    }
  }, [currentLevel, gameState]);

  const shuffleQuestions = (questions) => {
    return [...questions].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setFeedback({
      type: "error",
      message:
        "Time's up! The correct answer was: " +
        questions[currentQuestionIndex].correctAnswer,
    });
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        checkLevelCompletion();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswer("");
        setFeedback(null);
        setTimer(30);
        setTimerActive(true);
      }
    }, 1500);
  };

  const startGame = () => {
    setAnswer("");
    setGameState("playing");
    setCurrentLevel("easy");
    setCurrentQuestionIndex(0);
    setScore(0);
    setPreviousScore(0);
    setCorrectAnswers(0);
    setFeedback(null);
    setTimer(30);
    setTimerActive(true);
  };

  const handleReTryLevel = () => {
    setCurrentLevel(currentLevel);
    setScore(previousScore);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setGameState("playing");
    setFeedback(null);
    setAnswer("");
    setTimer(30);
    setTimerActive(true);
  };

  const handleAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setScore((prev) => prev + POINTS_PER_LEVEL[currentLevel]);
      setCorrectAnswers((prevCorrectAnswers) => {
        const updatedCorrectAnswers = prevCorrectAnswers + 1;

        if (currentQuestionIndex === questions.length - 1) {
          setTimeout(() => checkLevelCompletion(updatedCorrectAnswers), 1500);
        }

        return updatedCorrectAnswers;
      });
      setFeedback({ type: "success", message: "Correct!" });
    } else {
      setFeedback({
        type: "error",
        message: `Incorrect. The correct answer was: ${currentQuestion.correctAnswer}`,
      });

      if (currentQuestionIndex === questions.length - 1) {
        setTimeout(() => checkLevelCompletion(correctAnswers), 1500);
      }
    }

    if (currentQuestionIndex !== questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setAnswer("");
        setFeedback(null);
        setTimer(30);
        setTimerActive(true);
      }, 1500);
    }
  };

  const checkLevelCompletion = (updatedCorrectAnswers) => {
    if (updatedCorrectAnswers >= REQUIRED_CORRECT_ANSWERS) {
      if (currentLevel === "hard") {
        setGameState("game-over");
        setReTryLevel(false);
      } else {
        setGameState("level-complete");
        setReTryLevel(false);
        setFeedback({
          type: "success",
          message: `Congratulations! You've completed the ${currentLevel} level!`,
        });
      }
    } else {
      setGameState("game-over");
      setReTryLevel(true);
      setFeedback({
        type: "error",
        message: `You need at least ${REQUIRED_CORRECT_ANSWERS} correct answers to advance. Try again!`,
      });
    }
  };

  const nextLevel = () => {
    const levels = ["easy", "medium", "hard"];
    const currentIndex = levels.indexOf(currentLevel);
    setCurrentLevel(levels[currentIndex + 1]);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setPreviousScore(score);
    setGameState("playing");
    setFeedback(null);
    setAnswer("");
    setTimer(30);
    setTimerActive(true);
  };

  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex] || null;
  };

  const renderQuestion = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    return (
      <Box sx={{ width: "100%" }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{ mb: 3 }}
        >
          {question.question}
        </Typography>

        {question.type === "multiple-choice" && (
          <RadioGroup
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  m: 0,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            ))}
          </RadioGroup>
        )}

        {question.type === "true-false" && (
          <RadioGroup
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            {["true", "false"].map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  flex: 1,
                  m: 0,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            ))}
          </RadioGroup>
        )}

        {question.type === "text-input" && (
          <TextField
            fullWidth
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here"
            margin="normal"
          />
        )}
      </Box>
    );
  };

  const renderGameState = () => {
    switch (gameState) {
      case "start":
        return (
          <Box textAlign="center" sx={{ p: isMobile ? 2 : 4 }}>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
              Welcome to the Quiz Game!
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Test your knowledge across different difficulty levels.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={startGame}
              size={isMobile ? "medium" : "large"}
            >
              Start Quiz
            </Button>
          </Box>
        );

      case "playing":
        return (
          <Stack spacing={3} sx={{ p: isMobile ? 2 : 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">
                  Level: {currentLevel}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  align={isMobile ? "left" : "center"}
                >
                  Score: {score}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="subtitle1"
                  align={isMobile ? "left" : "right"}
                >
                  Question {currentQuestionIndex + 1}/{questions.length}
                </Typography>
              </Grid>
            </Grid>

            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Time remaining: {timer} seconds
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(timer / 30) * 100}
                color={timer < 10 ? "error" : "primary"}
              />
            </Box>

            {renderQuestion()}

            {feedback && (
              <Alert
                severity={feedback.type === "success" ? "success" : "error"}
              >
                {feedback.message}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleAnswer}
              disabled={!answer || feedback}
              fullWidth
              size={isMobile ? "medium" : "large"}
              sx={{ mt: 2 }}
            >
              Submit Answer
            </Button>
          </Stack>
        );

      case "level-complete":
        return (
          <Box textAlign="center" sx={{ p: isMobile ? 2 : 4 }}>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
              Level Complete!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Current Score: {score}
            </Typography>
            {feedback && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {feedback.message}
              </Alert>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={nextLevel}
              size={isMobile ? "medium" : "large"}
            >
              Next Level
            </Button>
          </Box>
        );

      case "game-over":
        return (
          <Box textAlign="center" sx={{ p: isMobile ? 2 : 4 }}>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
              Game Over!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Final Score: {score}
            </Typography>
            {feedback && (
              <Alert
                severity={feedback.type === "success" ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                {feedback.message}
              </Alert>
            )}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
            >
              {reTryLevel && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReTryLevel}
                  size={isMobile ? "medium" : "large"}
                >
                  Retry Level
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={startGame}
                size={isMobile ? "medium" : "large"}
              >
                Play Again
              </Button>
            </Stack>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 2 : 4 }}>
      <Card raised>
        <CardHeader
          title={
            <Typography variant={isMobile ? "h5" : "h4"} align="center">
              Multi-Level Quiz Game
            </Typography>
          }
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            p: isMobile ? 2 : 3,
          }}
        />
        <CardContent sx={{ p: 0 }}>{renderGameState()}</CardContent>
      </Card>
    </Container>
  );
};

export default QuizGame;
