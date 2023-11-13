import { useState, useEffect } from "react";
import {
  getLines,
  getMessages,
  getNextStop,
  getStopPlacesForLine,
} from "./services";
import { addFavorite, getFavorite, removeFavorites } from "./services/storage";
import type {
  Line,
  StopPlace,
  StopTime,
  Favorite,
  Message,
  FormatedMessage,
} from "./types";
import Logo from "./assets/logo_transparent.png";
import { FaArrowRight, FaSave, FaTrash } from "react-icons/fa";
import * as infos from "../package.json";
import "./App.css";
import DisplayMessage from "./components/DisplayMessage";

function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stopPlaces, setStopPlaces] = useState<StopPlace[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line>();
  const [selectedStopPlace, setSelectedStopPlace] = useState<StopPlace>();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [results, setResults] = useState<StopTime[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getFavorite().then((data) => {
      if (data) {
        setFavorites(data);
      }
    });

    getLines().then((data) => {
      setLines(data);
    });
    getMessages().then((data) => {
      setMessages(data);
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (selectedLine !== undefined) {
      getStopPlacesForLine(selectedLine.id).then((data) => {
        setStopPlaces(data);
      });
    }
    setSelectedStopPlace(undefined);
    setResults([]);
    setIsLoading(false);
  }, [selectedLine]);

  useEffect(() => {
    setResults([]);
  }, [selectedLine, selectedStopPlace]);

  const onNextStop = async () => {
    await getNextStop(
      selectedLine?.id as string,
      selectedStopPlace?.id as string,
    ).then((data) => {
      setResults(data);
    });
  };

  const addingFavorite = async (fav: Favorite) => {
    await addFavorite(fav);
    await getFavorite().then((data) => {
      if (data) {
        setFavorites(data);
      }
    });
  };

  const removingFavorite = async (fav: Favorite) => {
    await removeFavorites(fav);
    await getFavorite().then((data) => {
      if (data) {
        setFavorites(data);
      }
    });
  };

  const setFavoriteOnSearch = async (favorite: Favorite) => {
    await setSelectedLine(favorite.selectedLine);
    setSelectedStopPlace(favorite.selectedStopPlace);
  };

  const getMessageForLine = (lineId: string): FormatedMessage | undefined => {
    for (const entry of messages) {
      const lines = entry.lines;
      if (lines?.[0].id === lineId) {
        return entry.message;
      }
    }
    return undefined;
  };

  if (isLoading) {
    return <div className="loaderContainer">{/* todo: Loader */}</div>;
  }

  return (
    <div className="App">
      <h1>
        <a href="/" target="_blank" rel="noreferrer">
          <img src={Logo} className="logo" alt="logo" />
        </a>
      </h1>

      {/* date */}
      <p className="dateDisplay">
        Date:{" "}
        {new Date().toLocaleString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>

      {/* favorites handler */}
      {favorites.length > 0 && (
        <div>
          <h3>Favoris:</h3>
          {favorites.map((favorite) => {
            return (
              <div
                className="favorite"
                key={`${favorite.selectedLine.shortName} - 
              ${favorite.selectedStopPlace.name} -> 
              ${favorite.selectedStopPlace.destinations[0].name}`}
                onClick={() => {
                  setFavoriteOnSearch(favorite);
                }}
              >
                <span
                  style={{
                    backgroundColor: favorite.selectedLine.bgXmlColor,
                    color: favorite.selectedLine.fgXmlColor,
                    padding: "0.3rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  {favorite.selectedLine.shortName}
                </span>
                {favorite.selectedStopPlace.name} {"-> "}
                {favorite.selectedStopPlace.destinations[0].name}
                <FaTrash
                  size={16}
                  onClick={() => {
                    removingFavorite(favorite);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="pseudoForm">
        {/* line select */}
        <div className="select">
          <label htmlFor="line-select">Ligne:</label>
          <select
            name="lines"
            id="line-select"
            value={selectedLine ? selectedLine.id : undefined}
            onChange={(e) => {
              setSelectedLine(lines.find((line) => line.id === e.target.value));
            }}
          >
            <option value={undefined}>Selectionner une ligne</option>
            {lines.map((line) => {
              return (
                <option key={line.id} value={line.id}>
                  {line.shortName} - {line.name}
                </option>
              );
            })}
          </select>
        </div>
        {selectedLine && (
          <DisplayMessage message={getMessageForLine(selectedLine.id)} />
        )}

        {/* StopPlace select */}
        <div className="select">
          <label htmlFor="stopPlace-select">Arrêt:</label>
          <select
            name="stopPlaces"
            id="stopPlace-select"
            value={selectedStopPlace ? selectedStopPlace.id : undefined}
            onChange={(e) => {
              setSelectedStopPlace(
                stopPlaces.find((stopPlace) => stopPlace.id === e.target.value),
              );
            }}
          >
            <option value={undefined}>Selectionner un arrêt</option>
            {stopPlaces.map((stopPlace) => {
              return (
                <option key={stopPlace.id} value={stopPlace.id}>
                  {stopPlace.name} - to {stopPlace.destinations[0].name}
                </option>
              );
            })}
          </select>
        </div>

        {/* actions */}
        <div className="actions">
          <button
            onClick={() => {
              addingFavorite({ selectedLine, selectedStopPlace } as Favorite);
            }}
            disabled={
              selectedLine === undefined || selectedStopPlace === undefined
            }
          >
            <FaSave /> Ajouter aux favoris
          </button>
          <button
            onClick={() => {
              onNextStop();
            }}
            disabled={
              selectedLine === undefined || selectedStopPlace === undefined
            }
          >
            <FaArrowRight /> Prochains passages
          </button>
        </div>
      </div>

      {/* results display */}
      {results.length > 0 &&
        results?.map((item) => {
          return (
            <span key={item.dateTime}>
              {new Date(item.dateTime).toLocaleString("fr-FR", {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          );
        })}

      <div className="footer">
        <span>
          Made with ❤️ and ☕️ by{" "}
          <a
            href="https://github.com/Joris-Lft"
            target="_blank"
            rel="noreferrer"
          >
            Joris Lefait
          </a>
        </span>
        <span>Version {infos.version}</span>
      </div>
    </div>
  );
}

export default App;
