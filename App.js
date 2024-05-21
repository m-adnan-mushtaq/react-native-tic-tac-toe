import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import bg from "./assets/blur.png";
import Cell from "./src/components/Cell";
import WoodBtn from "./src/components/WoodBtn";
import WoodBtnBg from "./assets/wodden-btn.png";
import { Audio } from "expo-av";
import UiModal from "./src/components/Modal";

const emptyMap = [
  ["", "", ""], // 1st row
  ["", "", ""], // 2nd row
  ["", "", ""], // 3rd row
];

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};

export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM;
  const [tapSound, setTapSound] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (currentTurn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  useEffect(() => {
    return tapSound
      ? () => {
          tapSound.unloadAsync();
        }
      : undefined;
  }, [tapSound]);

  async function playSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./media/tap.wav")
      );
      setTapSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  const onPress = async (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    await playSound();
    setCurrentTurn(currentTurn === "x" ? "o" : "x");
  };

  const getWinner = (winnerMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every((cell) => cell === "x");
      const isRowOWinning = winnerMap[i].every((cell) => cell === "o");

      if (isRowXWinning) {
        return "x";
      }
      if (isRowOWinning) {
        return "o";
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (winnerMap[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        return "x";
      }
      if (isColumnOWinner) {
        return "o";
      }
    }

    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }

      if (winnerMap[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return "o";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return "x";
    }
  };

  const checkTieState = () => {
    if (!map.some((row) => row.some((cell) => cell === ""))) {
      setShowModal(true);
      setModalMessage(`It's a tie`);
    }
  };

  const gameWon = (player) => {
    setShowModal(true);
    setModalMessage(`Huraaay ,Player ${player.toUpperCase()} won`);
  };

  const resetGame = () => {
    setMap([
      ["", "", ""], // 1st row
      ["", "", ""], // 2nd row
      ["", "", ""], // 3rd row
    ]);
    setCurrentTurn("x");
    handleCloseModal();
  };

  const changeGameMode = (mode) => {
    if (mode === gameMode) return;
    setGameMode(mode);
    resetGame();
  };

  const botTurn = () => {
    // collect all possible options
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let chosenOption;

    if (gameMode === "BOT_MEDIUM") {
      // Attack
      possiblePositions.forEach((possiblePosition) => {
        const mapCopy = copyArray(map);

        mapCopy[possiblePosition.row][possiblePosition.col] = "o";

        const winner = getWinner(mapCopy);
        if (winner === "o") {
          // Attack that position
          chosenOption = possiblePosition;
        }
      });

      if (!chosenOption) {
        // Defend
        // Check if the opponent WINS if it takes one of the possible Positions
        possiblePositions.forEach((possiblePosition) => {
          const mapCopy = copyArray(map);

          mapCopy[possiblePosition.row][possiblePosition.col] = "x";

          const winner = getWinner(mapCopy);
          if (winner === "x") {
            // Defend that position
            chosenOption = possiblePosition;
          }
        });
      }
    }

    // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
        <ImageBackground
          style={{
            width: 250,
            height: 100,
            position: "absolute",
            top: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          source={WoodBtnBg}
          width={200}
          height={150}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 30,
                color: "white",
                fontWeight: "900",
              }}
            >
              Current Turn:{" "}
            </Text>
            <Text
              style={{
                color: currentTurn === "x" ? "#10b981" : "#06b6d4",
                elevation: 8,
                fontSize: 40,
                fontWeight: "900",
              }}
            >
              {currentTurn.toUpperCase()}
            </Text>
          </View>
        </ImageBackground>
        <ImageBackground
          style={{
            width: 350,
            height: 350,
            aspectRatio: "1/1",
          }}
          resizeMode="cover"
          source={require("./assets/final-board.png")}
        >
          <View
            style={[
              // styles.map,
              {
                // display: "none",
                // position: "absolute",
                // width: 260,
                // height: 260,
                aspectRatio: 1,
                transform: [
                  {
                    translateX: 38,
                  },
                  {
                    translateY: 30,
                  },
                ],
                // top: 17,
                // left: 46,
              },
            ]}
          >
            {map.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((cell, columnIndex) => (
                  <Cell
                    key={`row-${rowIndex}-col-${columnIndex}`}
                    cell={cell}
                    onPress={() => onPress(rowIndex, columnIndex)}
                  />
                ))}
              </View>
            ))}
          </View>
        </ImageBackground>

        <View style={styles.buttons}>
          <WoodBtn
            active={gameMode === "LOCAL"}
            onClick={() => changeGameMode("LOCAL")}
          >
            Practice
          </WoodBtn>

          <WoodBtn
            active={gameMode === "BOT_EASY"}
            onClick={() => changeGameMode("BOT_EASY")}
          >
            Easy
          </WoodBtn>

          <WoodBtn
            active={gameMode === "BOT_MEDIUM"}
            onClick={() => changeGameMode("BOT_MEDIUM")}
          >
            Hard
          </WoodBtn>
        </View>
      </ImageBackground>

      <StatusBar hidden hideTransitionAnimation="slide" />
      <UiModal
        show={showModal}
        handleReset={resetGame}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242D34",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",

    paddingTop: 15,
  },
  map: {
    // width: "80%",
    // aspectRatio: 1,
  },
  row: {
    // flex: 1,
    flexDirection: "row",
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    marginHorizontal: "auto",
  },
  button: {
    color: "white",
    margin: 10,
    fontSize: 16,
    backgroundColor: "#191F24",
    padding: 10,
    paddingHorizontal: 15,
  },
});
