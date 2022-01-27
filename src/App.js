import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import BentoIcon from "@mui/icons-material/Bento";

// checkbox
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// import Webcrawl from "./components/Webcrawl";

function App() {
  const [apiIngResults, setApiResults] = useState([]);
  const [apiRecipeResults, setApiRecipeResults] = useState([]);
  const [chosenIngredients, setChosenIngredients] = useState([]);
  const [allRecipeData, setAllRecipeData] = useState([]);

  var tags = [];

  const theme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#935858",
      },
      secondary: {
        main: "#589393",
      },
      error: {
        main: "#935875",
      },
      warning: {
        main: "#939358",
      },
      info: {
        main: "#589358",
      },
    },
    typography: {
      fontFamily: "Rubik",
    },
  });

  const blankCheckIcon = <CheckCircleOutlineRoundedIcon fontSize="small" />;
  const checkedIcon = <CheckCircleRoundedIcon fontSize="small" />;

  function getAutoCompleteData(inputContent) {
    if (inputContent.length > 0) {
      fetch(
        `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=45e5ae9cd62d47c096303e40ee60ea5a&query=${inputContent}&number=5`
      )
        .then((response) => response.json())
        .then((data) => {
          let list = [];
          for (let i = 0; i < data.length; i++) {
            list.push(data[i].name);
          }
          setApiResults(list);
        });
    }
  }

  function getStringRecipes() {
    let res = "";
    tags.forEach((el) => (res += el + ","));
    return res;
  }
  function getRecipeData() {
    console.log("reachedGetRecipeData");

    let stringIng = getStringRecipes();
    console.log("string version of ingredients: " + stringIng);
    if (tags.length > 0) {
      fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=45e5ae9cd62d47c096303e40ee60ea5a&ingredients=${stringIng}&number=3`
      )
        .then((response) => response.json())
        .then((data) => {
          setAllRecipeData(data);
          console.log(data);
          let list = [];
          for (let i = 0; i < data.length; i++) {
            list.push(data[i].title);
          }
          setApiRecipeResults(list);
        });
    }
    // start();
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            height: 500,
          },
        }}
      >
        <Paper elevation={3}>
          <div className="paper-padding">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={apiIngResults}
                  disableCloseOnSelect
                  onChange={(event, newVals) => {
                    tags = newVals;
                    console.log("chosen pieces: " + tags);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={blankCheckIcon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                      {console.log("chosen ingredients: " + chosenIngredients)}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ADD INGREDIENTS"
                      placeholder="ingredient..."
                      onChange={(e) => getAutoCompleteData(e.target.value)}
                      // when something is typed differently...
                      // 1. trigger onChange
                      // 2. set the event to e, which is then passed
                    />
                  )}
                />
                <Fab
                  variant="extended"
                  color="secondary"
                  onClick={getRecipeData}
                >
                  <BentoIcon sx={{ mr: 1 }} />
                  Generate My Meals
                </Fab>
              </Grid>
              <Grid item xs={8}>
                {allRecipeData.map((res, i) => (
                  <div>
                    <h3>{res.title}</h3>
                    <img width="100" height="100" src={res.image}/>
                  </div>
                ))}
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
