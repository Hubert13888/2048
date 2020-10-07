import React, {Component, useState, useEffect, useRef, useImperativeHandle} from 'react'
import { inflate } from 'zlib'
import { randomBytes } from 'crypto'

export default function Home() {
  const [pos, setPos] = useState('game-4x4')
  const gameRef = useRef(null)

  return (
    <main>
      {pos == 'main-menu' ? <ul>
        <li onClick={e => {
          setPos('game-4x4')
      }}>Standard 4x4</li>
        <li>Credits</li>
      </ul> : void(0)} 
      {pos == 'game-4x4' ? <ul>
        <button onClick={e => {
          setPos('main-menu')
        }}>Return</button>

        <button onClick={e => {
          gameRef.current.newGame()
        }}>Reset</button>

        <Game width={4} height={4} ref={gameRef}/>
      </ul> : void(0)}
    </main>
  )
}

interface Props {
  width: number,
  height: number
}
interface Tile {
  x: number,
  y: number,
  content: number
}

class Game extends Component<Props> {
  state = {
    width: 0,
    height: 0,
    amount: 0,
    tiles: []
  }
  constructor(props: Props) {
    super(props)
    
    this.state.width = props.width
    this.state.height = props.height
    this.state.amount = props.width * props.height
    this.newGame()
  }
  findTile(x: number, y: number){
    let tile: Tile
    for(tile of this.state.tiles)
      if(x == tile.x && y == tile.y)
        return tile
    return null
  }
  componentDidMount() {
    window.onkeydown = (e: any) => {
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        let colOrRow : boolean, reversed : boolean

        if(e.keyCode == 37) { //left
          colOrRow = true
          reversed = false
        }
        else if(e.keyCode == 38) { //up
          colOrRow = false
          reversed = false
        }
        else if(e.keyCode == 39) { //right
          colOrRow = true
          reversed = true
        }
        else if(e.keyCode == 40) { //down
          colOrRow = false
          reversed = true
        }
        let crows : Tile[][] = this.getColsOrRows(colOrRow)
        let newTiles: Tile[] = this.countNewGamePosition(this.duplicateTile(crows), reversed)
        let moved = this.compareTiles(newTiles, crows.flat())
        if(moved) {
          let newTile = this.getRandomFields(this.getNonOccupiedFields(newTiles.filter(tile => {
            if(tile.content != 0) return tile
          }).map(tile => [tile.x, tile.y])), 1)[0]

          for(let i=0; i<newTiles.length; i++)
            if(newTiles[i].x == newTile[0] && newTiles[i].y == newTile[1])
              newTiles[i].content = this.getNewTileValue();

          this.setState({tiles: newTiles})
        }
      }
    }
  }

  compareTiles(a : Tile[], b : Tile[]) : boolean {
    a = this.sortTiles(a)
    b = this.sortTiles(b)

    for(let i = 0; i < this.state.amount; i++) {
      if(a[i].content != b[i].content) return true
    }
    return false
  }

  sortTiles(arr: Tile[]) {
    return arr.sort((b, c) => {
      if(b.x > c.x || (b.x === c.x && b.y > c.y)) return 1
      return -1
    })
  }

  duplicateTile(arr: Tile[][]) {
    let a = []
    for(let i=0; i<arr.length; i++) {
      a.push([])
      for(let b of arr[i]) {
        a[i].push({...b})
      }
    }
    return a
  }

  getNewTileValue() : number{
    let r = Math.random()
    return r < 0.2 ? 4 : 2
  }

  countNewGamePosition(tileArray: Array<Tile[]>, reversed: boolean) {
    /*REVERSE ALTERNATE COMMENTS IN <>*/
    let r = reversed

    for(let i=0; i<tileArray.length; i++) { //[Tile1_1, Tile1_2, ...] [Tile2_1, Tile2_2, ...] ...
      let n : any = this.getTileArrayContent(tileArray[i]) //n = [0, 2, 0, 0, 2, 4, 0, 8, 8, 8]
      let m = [...n] //There we'll be counting the number of fields each taile has to pass
      for(let j=0; j<m.length; j++) m[j] = 0

      for(let j=(r ? n.length - 1 : 0); r ? j>=1 : j<n.length - 1; r ? j-- : j++) { 
          //0 2 0 0 2 4 0 8 8 <8 8 0 4 2 0 0 2 0>
        if(n[j] != 0 && j != 0) m[j] = j + 1
        for(let k=(r ? j-1 : j+1); r ? k>=0 : k<n.length; r ? k-- : k++) { 
            //for first j=1 <j=n.length-2> (n[j]=2) loops for n[j]: 0 0 2
          if(n[k] != 0) { 
            if(n[j] == n[k]) { //so it check if there's any 2 nearby
              n[j] = [n[j], n[k]]
              n[k] = 0 //0 [2, 2] 0 0 0 4 0 [8, 8] 8 <0 [2, 2] 0 0 0 4 0 8 [8, 8]>
              m[k] = j + k + 1
              j=k
            }
            break
          }
        }
      }
      let zeroCounter = 0
      for(let j=0; j<n.length; j++) { //0 [2, 2] 0 0 0 4 0 [8, 8] 8 <0 [2, 2] 0 0 0 4 0 8 [8, 8]>
        if(typeof n[j] === 'undefined') break
        if(n[j] == 0) { 
          zeroCounter++ //5
          n.splice(j, 1) //[2, 2] 4 [8, 8] 8 <[2, 2] 4 8 [8, 8]>
          j--
        }
        else if(n[j][0]) n[j] = parseInt(n[j][0]) + parseInt(n[j][1]) //4 4 16 8 <4 4 8 16>
      }
      for(let j=0; j<zeroCounter; j++) r ? n.unshift(0) : n.push(0) //4 4 16 8 0 0 0 0 0 <0 0 0 0 0 4 4 8 16>

      for(let j=0; j<n.length; j++) {
        tileArray[i][j].content = n[j]
      }
      console.log(m)
    }
    
    return tileArray.flat()
  }

  getTileArrayContent(tiles: Tile[]) : number[]{
    let contentArray = []
    for(let tile of tiles) contentArray.push(tile.content)
    return contentArray
  }
  getColsOrRows(colOrRow: boolean) : Array<Tile[]>{ //L to R / U to B
    let colrow = []
    for(let i = 0; i < (colOrRow ? this.state.width : this.state.height); i++)
      colrow.push([])

    this.state.tiles.map(tile => {
      colOrRow ? colrow[tile.x].push(tile) : colrow[tile.y].push(tile)
    })
    return colrow
  }

  getNonOccupiedFields(exclFields: Array<number[]>) : Array<number[]> {
    let cleanFields = [] //[[0,1], [2,1]]
    for(let i = 0; i < this.state.width; i++) {
      for(let j = 0; j < this.state.height; j++) {
        let existFlag = false
        for(let pair of exclFields) // [0,1]
          if(pair[0] == i && pair[1] == j) existFlag = true
        if(!existFlag) cleanFields.push([i, j])
      }
    }
    return cleanFields
  }
  getRandomFields(arrayOfFields: Array<number[]>, amount: number) {
    let arrayOfChosen = []
    for(let i = 0; i < amount; i++) {
      let randomNumber = Math.floor(Math.random() * arrayOfFields.length)
      arrayOfChosen.push(arrayOfFields[randomNumber])
      arrayOfFields.splice(randomNumber, 1)
    }
    return arrayOfChosen
  }
  newGame() {
    let fieldsToBegin = this.getRandomFields(this.getNonOccupiedFields([]), 2),
        fields: Array<Tile> = []

    for(let i = 0; i < this.state.width; i++) {
      for(let j = 0; j < this.state.height; j++)
        fields.push({
          x: i,
          y: j,
          content: (() => {
            for(let field of fieldsToBegin)
              if(field[0] == i && field[1] == j) return this.getNewTileValue()
            return 0
          })()
        })
    }
    this.setState({
      tiles: fields
    })
    this.state = {
      ...this.state,
      tiles: fields
    }
  }
  render() {
    return(<>
    <style dangerouslySetInnerHTML={{__html: `
        .game_field {
          width: calc(50vw / ${this.state.width});
          height: calc(50vw / ${this.state.width});
        }
      `
    }} />
    <table className="game">
      {
        Array.from(Array(this.state.height).keys()).map(i => {
          return(
            <tr className="game_row">
              {Array.from(Array(this.state.width).keys()).map(j => {
                  let matchTile = this.findTile(i, j) 
                  return(
                    <td className="game_field">
                      {<div className={"game_tile tile_" + matchTile.content}> {matchTile.content ? matchTile.content : ''}</div>}
                    </td>
                  )
              })}
            </tr>
          )
        })
      }
    </table></>)
  }
}