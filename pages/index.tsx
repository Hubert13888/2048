import React, { Component } from "react";
import ClassNames from "classnames";

interface StateMenu {
  menuPosition: string;
  game: Game[];
  inputs: {
    width: number;
    height: number;
    content_of_new_1: number;
    content_of_new_2: number;
    number_of_new: number;
    winning_tile: number;
  };
  errors: string[];
}

export default class Home extends Component {
  state: StateMenu = {
    menuPosition: "main-menu",
    game: [],
    inputs: {
      width: 4,
      height: 4,
      content_of_new_1: 4,
      content_of_new_2: 2,
      number_of_new: 1,
      winning_tile: 2048
    },
    errors: []
  };

  formSubmit(e: React.FormEventHandler) {
    let formData = new FormData(e.target);
    let width,
      height,
      content_of_new_1,
      content_of_new_2,
      number_of_new,
      winning_tile,
      error = [];
    for (let data of formData) {
      let content = data[1].trim();
      if (data[0] == "width") {
        if (!content.match(/^[1-9][0-9]*$/))
          error.push("A width of the game should be a number greater than 0");
        else width = parseInt(content);
      } else if (data[0] == "height") {
        if (!content.match(/^[1-9][0-9]*$/))
          error.push("A height of the game should be a number greater than 0");
        else height = parseInt(content);
      } else if (data[0] == "content_of_new_1") {
        if (!content.match(/^[-]?(([0-9]*[.])|([1-9]))[0-9]*$/))
          error.push("First tile's value is not numeric");
        else content_of_new_1 = parseFloat(content);
      } else if (data[0] == "content_of_new_2") {
        if (!content.match(/^[-]?(([0-9]*[.])|([1-9]))[0-9]*$/))
          error.push("Second tile's value is not numeric");
        else content_of_new_2 = parseFloat(content);
      } else if (data[0] == "number_of_new") {
        if (!content.match(/^[1-5]$/))
          error.push(
            "Number of new tiles must be greater or equal than 1 and lower than 5"
          );
        else number_of_new = parseInt(content);
      } else if (data[0] == "winning_tile") {
        if (!content.match(/^[-]?[1-9][0-9]*$/))
          error.push("A winning tile must be numeric");
        else winning_tile = parseInt(content);
      }
    }
    if (error[0])
      this.setState((prev: StateMenu) => ({
        errors: [...error]
      }));
    else
      this.createGame(
        width,
        height,
        content_of_new_1,
        content_of_new_2,
        number_of_new,
        winning_tile
      );
  }

  deleteGames() {
    this.setState((prev: StateMenu) => ({
      game: [
        ...prev.game.map(() => {
          return void 0;
        })
      ]
    }));
  }
  createGame(
    width: number = 4,
    height: number = 4,
    content_of_new_1: number = 4,
    content_of_new_2: number = 2,
    number_of_new: number = 1,
    winning_tile: number = 2048
  ) {
    this.setState((prev: StateMenu) => ({
      menuPosition: "new-game",
      game: [
        ...prev.game,
        <Game
          width={width}
          height={height}
          content_of_new_1={content_of_new_1}
          content_of_new_2={content_of_new_2}
          number_of_new={number_of_new}
          winning_tile={winning_tile}
          gameOver={() => {}}
          win={() => {}}
        />
      ]
    }));
  }

  generateInput(name: string) {
    return (
      <input
        type="text"
        name={name}
        value={this.state.inputs[name]}
        onChange={(e) => {
          e.persist();
          this.setState((prev: StateMenu) => ({
            inputs: {
              ...prev.inputs,
              [name]: e.target.value
            }
          }));
        }}
      />
    );
  }

  render() {
    return (
      <main>
        <button
          className={ClassNames({
            returnButton: true,
            back: true,
            hide_menu_routes: true,
            show_menu_routes: this.state.menuPosition != "main-menu"
          })}
          onClick={() => this.setState({ menuPosition: "main-menu" })}
        >
          Back
        </button>

        <div
          className={ClassNames({
            menu: true,
            hide_menu_routes: true,
            show_menu_routes: this.state.menuPosition == "main-menu"
          })}
        >
          <p>
            Welcome to 2048! In this game your task is to connect tiles with
            same number and get to 2048 by moving the all the tiles on the board
          </p>
          <div className="main_menu">
            <span>
              <title>2048</title>
            </span>

            <p
              onClick={() => {
                this.createGame();
              }}
            >
              Classic 2048 4x4
            </p>

            <p
              onClick={() => {
                this.createGame(4, 5, -2, 2, 1, 512);
              }}
            >
              Negative 512 4x5
            </p>

            <p
              onClick={() => {
                this.setState((prev: StateMenu) => ({
                  menuPosition: "customize"
                }));
              }}
            >
              Customize
            </p>

            <p
              onClick={() =>
                this.setState({
                  menuPosition: "credits"
                })
              }
            >
              Credits
            </p>
          </div>
        </div>

        <div
          className={ClassNames({
            customize_panel: true,
            hide_menu_routes: true,
            show_menu_routes: this.state.menuPosition == "customize"
          })}
          onTransitionEnd={() => {}}
        >
          <title>
            Please enter the parameters below to customize your game
          </title>
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              this.formSubmit(e);
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td className="text_td">Game size</td>
                  <td className="input_td">
                    {this.generateInput("width")}
                    {this.generateInput("height")}
                  </td>
                </tr>
                <tr>
                  <td className="text_td">
                    Content of new tiles (can be any number)
                  </td>
                  <td className="input_td">
                    {this.generateInput("content_of_new_1")}
                    {this.generateInput("content_of_new_2")}
                  </td>
                </tr>
                <tr>
                  <td className="text_td">New tiles amount (min 1, max 5)</td>
                  <td className="input_td">
                    {this.generateInput("number_of_new")}
                  </td>
                </tr>
                <tr>
                  <td className="text_td">Winning tile</td>
                  <td className="input_td">
                    {this.generateInput("winning_tile")}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form_errors">{this.state.errors[0]}</div>

            <button>Play Game</button>
          </form>
        </div>

        <div
          className={ClassNames({
            hide_menu_routes: true,
            show_menu_routes: this.state.menuPosition == "new-game"
          })}
          onTransitionEnd={() => {
            if (this.state.menuPosition != "new-game") this.deleteGames();
          }}
        >
          {this.state.game}
        </div>

        <div
          className={ClassNames({
            credits: true,
            hide_menu_routes: true,
            show_menu_routes: this.state.menuPosition == "credits"
          })}
        >
          <title>2048</title>
          <p>Game made by</p>
          <a href="http://hubert-siwczynski.000webhostapp.com" target="_blank">
            Hubert13888
          </a>
          <p>using React.</p>
          <p>
            Based on the same title game made by
            <a
              className="a_embded"
              href="https://play.google.com/store/apps/details?id=com.androbaby.game2048&hl=pl"
              target="_blank"
            >
              Gabriele Cirulli
            </a>
          </p>
        </div>
      </main>
    );
  }
}

interface Props {
  width: number;
  height: number;
  content_of_new_1: number;
  content_of_new_2: number;
  number_of_new: number;
  winning_tile: number;
  gameOver: () => void;
  win: () => void;
  ref?: any;
}
interface Tile {
  x: number;
  y: number;
  content: number;
  afterAnimate?: number;
  transformDirection?: string;
  transitionFinished?: boolean;
  hasToBeAnimated?: boolean;
  destinationPoint?: boolean;
  tilesCount?: number;
  isCombined?: boolean;
}
interface State {
  parent?: any;
  width: number;
  height: number;
  content_of_new_1: number;
  content_of_new_2: number;
  number_of_new: number;
  winning_tile: number;
  amount: number;
  gameOver: boolean;
  endFadeInAnimation: boolean;
  gameOverFunc: () => void;
  win: boolean;
  playMore: boolean;
  winFunc: () => void;
  transitionFinished: boolean;
  tiles: Tile[][];

  touchStartX: number;
  touchStartY: number;
  touchEndX: number;
  touchEndY: number;
}

class Game extends Component<Props> {
  ismounted = false;

  state: State = {
    width: 0,
    height: 0,
    content_of_new_1: 4,
    content_of_new_2: 2,
    number_of_new: 1,
    winning_tile: 2048,
    amount: 0,
    gameOver: false,
    endFadeInAnimation: false,
    gameOverFunc: () => {},
    win: false,
    playMore: false,
    winFunc: () => {},
    transitionFinished: true,
    tiles: [],
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0
  };
  constructor(props: Props) {
    super(props);

    this.state.width = props.width;
    this.state.height = props.height;
    this.state.content_of_new_1 = props.content_of_new_1;
    this.state.content_of_new_2 = props.content_of_new_2;
    this.state.number_of_new = props.number_of_new;
    this.state.winning_tile = props.winning_tile;
    this.state.gameOverFunc = props.gameOver;
    this.state.winFunc = props.win;
    this.state.amount = props.width * props.height;
  }

  moveHandle(colOrRow: boolean, reversed: boolean, direction: string) {
    let crows: Tile[][] = this.getColsOrRows(colOrRow);
    let newTilesDouble: Tile[][] = this.countNewGamePosition(
      this.duplicateTile(crows),
      reversed
    );
    let newTiles = newTilesDouble.flat();

    let moved = this.compareTiles(newTiles, crows.flat());
    if (moved) {
      let dicedTiles = this.getRandomFields(
        this.getNonOccupiedFields(
          newTiles
            .filter((tile) => {
              if (tile.afterAnimate != 0) return tile;
            })
            .map((tile) => [tile.x, tile.y])
        ),
        this.state.number_of_new
      );

      let gameOver = false,
        win = false;

      for (let i = 0; i < newTiles.length; i++) {
        newTiles[i].transformDirection = direction;
        for (let dicedTile of dicedTiles) {
          if (typeof dicedTile == "undefined") {
            gameOver = true;
            break;
          }
          if (newTiles[i].x == dicedTile[0] && newTiles[i].y == dicedTile[1]) {
            let newTileValue = this.getNewTileValue();
            newTiles[i].afterAnimate = newTileValue;
          }
        }
        if (gameOver) break;
      }

      let newTiles_2dim = this.fromOneToTwoDimArr(newTiles);

      if (!gameOver) if (this.checkForClutch(newTiles_2dim)) gameOver = true;
      for (let tile of newTiles)
        if (
          tile.afterAnimate == this.state.winning_tile &&
          !this.state.playMore
        )
          win = true;

      this.setState({
        tiles: newTiles_2dim,
        transitionFinished: false,
        gameOver,
        win
      });
    }
  }

  componentDidMount() {
    this.ismounted = true;
    this.newGame();
    window.ontouchstart = (e: any) =>
      this.setState({
        touchStartX: e.targetTouches[0].clientX,
        touchStartY: e.targetTouches[0].clientY
      });
    window.ontouchmove = (e: any) =>
      this.setState({
        touchEndX: e.targetTouches[0].clientX,
        touchEndY: e.targetTouches[0].clientY
      });
    window.ontouchend = (e: any) => {
      if (
        this.state.transitionFinished &&
        !this.state.gameOver &&
        (!this.state.win || this.state.playMore)
      ) {
        let colOrRow: boolean, reversed: boolean, direction: string;

        if (this.state.touchStartX - this.state.touchEndX > 100) {
          //left swipe
          colOrRow = true;
          reversed = false;
          direction = "L";
        }
        if (this.state.touchStartX - this.state.touchEndX < -100) {
          //right swipe
          colOrRow = true;
          reversed = true;
          direction = "R";
        }
        if (this.state.touchStartY - this.state.touchEndY > 100) {
          //up swipe
          colOrRow = false;
          reversed = false;
          direction = "U";
        }
        if (this.state.touchStartY - this.state.touchEndY < -100) {
          //down swipe
          colOrRow = false;
          reversed = true;
          direction = "D";
        }

        if (direction) {
          this.setState({ endFadeInAnimation: true });
          this.moveHandle(colOrRow, reversed, direction);
        }
      }
    };
    window.onkeydown = (e: any) => {
      if (
        (e.keyCode == 37 ||
          e.keyCode == 38 ||
          e.keyCode == 39 ||
          e.keyCode == 40) &&
        this.state.transitionFinished &&
        !this.state.gameOver &&
        (!this.state.win || this.state.playMore)
      ) {
        let colOrRow: boolean, reversed: boolean, direction: string;
        this.setState({ endFadeInAnimation: true });

        if (e.keyCode == 37) {
          //left
          colOrRow = true;
          reversed = false;
          direction = "L";
        } else if (e.keyCode == 38) {
          //up
          colOrRow = false;
          reversed = false;
          direction = "U";
        } else if (e.keyCode == 39) {
          //right
          colOrRow = true;
          reversed = true;
          direction = "R";
        } else if (e.keyCode == 40) {
          //down
          colOrRow = false;
          reversed = true;
          direction = "D";
        }
        this.moveHandle(colOrRow, reversed, direction);
      }
    };
  }
  fromOneToTwoDimArr(a: Tile[]): Tile[][] {
    let b = [];
    for (let i = 0; i < this.state.width; i++) b.push([]);
    for (let c of a) b[c.x].push(c);
    return b;
  }
  checkForClutch(a: Tile[][]) {
    let width = a.length,
      height = a[0].length;

    for (let i = 0; i < width; i++)
      for (let j = 0; j < height - 1; j++) {
        if (
          a[i][j].afterAnimate == a[i][j + 1].afterAnimate ||
          a[i][j].afterAnimate == 0 ||
          a[i][j + 1].afterAnimate == 0
        )
          return false;
      }
    for (let j = 0; j < height; j++)
      for (let i = 0; i < width - 1; i++) {
        if (
          a[i][j].afterAnimate == a[i + 1][j].afterAnimate &&
          a[i][j].afterAnimate != 0
        )
          return false;
      }

    return true;
  }

  compareTiles(a: Tile[], b: Tile[]): boolean {
    a = this.sortTiles(a);
    b = this.sortTiles(b);

    for (let i = 0; i < this.state.amount; i++) {
      if (a[i].afterAnimate != b[i].content) return true;
    }
    return false;
  }

  sortTiles(arr: Tile[]) {
    return arr.sort((b, c) => {
      if (b.x > c.x || (b.x === c.x && b.y > c.y)) return 1;
      return -1;
    });
  }

  duplicateTile(arr: Tile[][]) {
    let a = [];
    for (let i = 0; i < arr.length; i++) {
      a.push([]);
      for (let b of arr[i]) {
        a[i].push({ ...b });
      }
    }
    return a;
  }

  countNewGamePosition(tileArray: Array<Tile[]>, reversed: boolean) {
    /*REVERSE ALTERNATE COMMENTS IN <>*/

    let r = reversed;

    for (let i = 0; i < tileArray.length; i++) {
      //[Tile1_1, Tile1_2, ...] [Tile2_1, Tile2_2, ...] ...
      let n: any = this.getTileArrayContent(tileArray[i]); //n = [0, 2, 0, 0, 2, 4, 0, 8, 8, 8]
      let m = new Array(n.length).fill(0); //Array of tile movement counter (for transition)
      let l = new Array(n.length).fill(false); //Check if a tile was combined with another
      let positionCounter = 0;

      for (
        let j = r ? n.length - 1 : 0;
        r ? j >= 0 : j < n.length;
        r ? j-- : j++
      ) {
        //0 2 0 0 2 4 0 8 8 <8 8 0 4 2 0 0 2 0>
        if (n[j] != 0) {
          positionCounter++;
          m[j] = r ? n.length - j - positionCounter : j - (positionCounter - 1);
        }
        if (typeof (r ? n[j - 1] : n[j + 1]) !== "undefined")
          for (
            let k = r ? j - 1 : j + 1;
            r ? k >= 0 : k < n.length;
            r ? k-- : k++
          ) {
            //for first j=1 <j=n.length-2> (n[j]=2) loops for n[j]: 0 0 2
            if (n[k] != 0) {
              if (n[j] == n[k]) {
                //so it check if there's any 2 nearby
                n[j] = [n[j], n[k]];
                n[k] = 0; //0 [2, 2] 0 0 0 4 0 [8, 8] 8 <0 [2, 2] 0 0 0 4 0 8 [8, 8]>
                m[k] = r
                  ? n.length - k - positionCounter
                  : k - (positionCounter - 1);
                l[j] = true;
                l[k] = true;
                j = k;
              }
              break;
            }
          }
      }
      let zeroCounter = 0;
      for (let j = 0; j < n.length; j++) {
        //0 [2, 2] 0 0 0 4 0 [8, 8] 8 <0 [2, 2] 0 0 0 4 0 8 [8, 8]>
        if (typeof n[j] === "undefined") break;
        if (n[j] == 0) {
          zeroCounter++; //5
          n.splice(j, 1); //[2, 2] 4 [8, 8] 8 <[2, 2] 4 8 [8, 8]>
          j--;
        } else if (n[j][0]) n[j] = parseFloat(n[j][0]) + parseFloat(n[j][1]); //4 4 16 8 <4 4 8 16>
      }
      for (let j = 0; j < zeroCounter; j++) r ? n.unshift(0) : n.push(0); //4 4 16 8 0 0 0 0 0 <0 0 0 0 0 4 4 8 16>

      for (let j = 0; j < n.length; j++) {
        tileArray[i][j] = {
          x: tileArray[i][j].x,
          y: tileArray[i][j].y,
          content: tileArray[i][j].content,
          afterAnimate: n[j],
          destinationPoint: !!n[j],
          transitionFinished: false,
          hasToBeAnimated: m[j] ? true : false,
          tilesCount: m[j],
          isCombined: l[j]
        };
      }
    }
    return tileArray;
  }

  getTileArrayContent(tiles: Tile[]): number[] {
    let contentArray = [];
    for (let tile of tiles) contentArray.push(tile.content);
    return contentArray;
  }
  getColsOrRows(colOrRow: boolean): Array<Tile[]> {
    //L to R / U to B
    let colrow = [];
    for (let i = 0; i < (colOrRow ? this.state.width : this.state.height); i++)
      colrow.push([]);

    this.state.tiles.flat().map((tile) => {
      colOrRow ? colrow[tile.x].push(tile) : colrow[tile.y].push(tile);
    });
    return colrow;
  }

  getNonOccupiedFields(exclFields: Array<number[]>): Array<number[]> {
    let cleanFields = []; //[[0,1], [2,1]]
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        let existFlag = false;
        for (let pair of exclFields) // [0,1]
          if (pair[0] == i && pair[1] == j) existFlag = true;
        if (!existFlag) cleanFields.push([i, j]);
      }
    }
    return cleanFields;
  }
  getNewTileValue(): number {
    let r = Math.random();
    return r < 0.2 ? this.state.content_of_new_1 : this.state.content_of_new_2;
  }

  getRandomFields(arrayOfFields: Array<number[]>, amount: number) {
    let arrayOfChosen = [];
    for (let i = 0; i < amount; i++) {
      let randomNumber = Math.floor(Math.random() * arrayOfFields.length);
      arrayOfChosen.push(arrayOfFields[randomNumber]);
      arrayOfFields.splice(randomNumber, 1);
    }
    return arrayOfChosen;
  }
  newGame() {
    let fieldsToBegin = this.getRandomFields(this.getNonOccupiedFields([]), 2),
      fields: Array<Tile[]> = [];

    for (let i = 0; i < this.state.width; i++) {
      fields.push([]);
      for (let j = 0; j < this.state.height; j++) {
        let content = 0;
        for (let field of fieldsToBegin)
          if (field[0] == i && field[1] == j) content = this.getNewTileValue();

        fields[i].push({
          x: i,
          y: j,
          content,
          afterAnimate: content
        });
      }
    }

    this.setState({
      tiles: fields,
      gameOver: false,
      win: false,
      playMore: false,
      transitionFinished: true
    });
  }

  setPlayMore() {
    this.setState({ playMore: true });
  }

  win() {
    this.state.winFunc();
    this.setState({ playMore: true });
  }

  gameOver() {
    this.state.gameOverFunc();
  }

  render() {
    return (
      <>
        <button
          className="resetButton"
          onClick={() => {
            this.newGame();
          }}
        >
          Reset
        </button>

        <table>
          <tbody className="game">
            <div
              className={ClassNames({
                game_event: true,
                game_event_show: this.state.gameOver
              })}
            >
              <title>Game Over</title>
              <p>You just got stuck!</p>
            </div>

            <div
              className={ClassNames({
                game_event: true,
                game_event_show: this.state.win && !this.state.playMore
              })}
            >
              <title>You have won!</title>
              <p>Congratulations</p>
              <button className="win_continue" onClick={() => this.win()}>
                Endless Mode
              </button>
            </div>
            {this.state.tiles.map((row) => {
              return (
                <tr className="game_row">
                  {row.map((tile) => {
                    return (
                      <td
                        className="game_field"
                        style={{
                          width: `clamp(50px, 60vw / ${this.state.width}, 110px)`,
                          height: `clamp(50px, 60vw / ${this.state.width}, 110px)`
                        }}
                      >
                        {
                          <div
                            className={"game_tile show_no_transition tile_0"}
                          ></div>
                        }
                        {
                          <div
                            className={ClassNames({
                              game_tile: true,
                              [`tile_${tile.content}`]: true,
                              show: !tile.destinationPoint && tile.content,
                              show_no_transition: tile.content,
                              end_fade_in: this.state.endFadeInAnimation
                            })}
                            {...(tile.hasToBeAnimated
                              ? {
                                  style: {
                                    transition: `transform 200ms linear`,

                                    transform: `translate${
                                      ["L", "R"].includes(
                                        tile.transformDirection
                                      )
                                        ? "X"
                                        : "Y"
                                    }(${
                                      ["U", "L"].includes(
                                        tile.transformDirection
                                      )
                                        ? `clamp(
                                            calc(110px * ${-tile.tilesCount}),
                                            ${tile.tilesCount} * (50vw / ${-this
                                            .state.width}),
                                            calc(50px * ${-tile.tilesCount}))
                                          `
                                        : `clamp(
                                            calc(50px * ${tile.tilesCount}), 
                                            ${tile.tilesCount} * (50vw / ${this.state.width}),
                                            calc(110px * ${tile.tilesCount})
                                            `
                                    }`
                                  }
                                }
                              : {})}
                            onTransitionEnd={() => {
                              this.setState((prev: State) => ({
                                tiles: [
                                  ...prev.tiles.map((row) => {
                                    return row.map((tile) => {
                                      if (
                                        tile.x == tile.x &&
                                        tile.y == tile.y
                                      ) {
                                        tile.hasToBeAnimated = false;
                                      }
                                      tile.content = tile.afterAnimate;
                                      tile.transitionFinished = true;
                                      return tile;
                                    });
                                  })
                                ],
                                transitionFinished: true,
                                endFadeInAnimation: false
                              }));
                            }}
                          >
                            {tile.content ? tile.content : ""}
                          </div>
                        }
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}
