import React, {useRef} from 'react';
import Item from './snake/Item';
import Record from './Record';
import './App.css';

interface Cell {
  row: number
  column: number
}

class App extends React.Component<{}, any> {
  interval : number = 200;
  intervalId : any;
  columns: number = 20;
  rows: number = 20;
  blocks: number = 10;
  constructor(props: any) {
    super(props);    
    this.state = {
      food: this.getRandomCell(),    
      segments: [
        this.getRandomCell()   
      ],
      speed: {
        x: 1,
        y: 0
      },
      blocks: this.getNRandom(),
      direction: 'right'
    }    
  }

  componentDidMount = (): void => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {      
      this.update()
    }, this.interval);        
    document.addEventListener('keydown', this.moveHandler)
  }

  moveHandler = (event : KeyboardEvent) => {
    let direction = this.state.direction;
    let forbiddenDirection;
    switch(event.keyCode) {
      case 37:
        direction = 'left';
        forbiddenDirection = 'right';
        break;
      case 38:
        direction = 'up';
        forbiddenDirection = 'down';
        break;
      case 39:
        direction = 'right';
        forbiddenDirection = 'left';
        break;
      case 40:
        direction = 'down';
        forbiddenDirection = 'up';
        break;
    }

    if (direction !== this.state.direction && forbiddenDirection !== this.state.direction) {
      this.setState({
        direction,
        speed: {
          x: (direction === 'right' ? 1 : direction === 'left' ? -1 : 0),
          y: (direction === 'up' ? -1 : direction === 'down' ? 1 : 0)
        }
      })
    }
  }

  update = () => {
    let segments = this.state.segments;
    const head = segments.at(-1);
    let food = this.state.food;
    if(this.swallow(head)) {
      segments.push(head)
      food = this.getRandomCell();
    }      
    segments.shift()
    segments.push(this.setOnBox({
      column: head.column + this.state.speed.x,
      row: head.row + this.state.speed.y,
    })) 
    if(this.gameOver()){      
      segments = [this.getRandomCell()];
      food = this.getRandomCell()
    }
    this.setState({
      segments,
      food
    })
  }

  swallow = (head: Cell) => {
    return (this.state.food.column === head.column &&  this.state.food.row === head.row ? true : false)
  }

  gameOver() {    
    const segments = this.state.segments;
    const blocks = this.state.blocks;
    const head = segments.at(-1)
    return (segments.filter((segemet : Cell) => segemet.row === head.row && segemet.column === head.column).length > 1) || (blocks.filter((block : Cell) => block.row === head.row && block.column === head.column).length > 0)
  }

  setOnBox = (cell: Cell) => {
    if(cell.column > this.columns - 1) {
      cell.column = 0
    } else if (cell.column < 0) {
      cell.column = this.columns - 1
    }

    if(cell.row > this.rows - 1) {
      cell.row = 0
    } else if (cell.row < 0) {
      cell.row = this.rows - 1
    }
    return cell;
  }

  getRandomCell = () : Cell => {
    const uniqueCell = {
      row: Math.floor(Math.random() * this.rows),
      column: Math.floor(Math.random() * this.columns)
    } 
    if (this.state) {
      const sLength = this.state.segments.length;
      for (let i = 0; i < sLength; i++) {
        if(this.state.segments.filter((s : Cell) => s.row === uniqueCell.row &&  s.column === uniqueCell.column).length > 0)
          return this.getRandomCell();
      }
      const bLength = this.state.blocks.length;
      for (let i = 0; i < bLength; i++) {
        if(this.state.blocks.filter((b : Cell) => b.row === uniqueCell.row &&  b.column === uniqueCell.column).length > 0)
          return this.getRandomCell();
      }      
    }        
    return uniqueCell
  }

  draw = () => {  
    const items = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if(this.state.food.column === j && this.state.food.row === i) {
          items.push(<Item className="food"/>)  
        } else {
          items.push(<Item className="item"/>)  
        }              
      }
    }

    for (let i = 0; i < this.state.blocks.length; i++) {
      let block = this.state.blocks[i];      
      items[block.row * this.rows + block.column] = <Item className={'block'}></Item>;  
    }

    const snakeLength = this.state.segments.length;
    for (let i = 0; i < this.state.segments.length; i++) {
      let segment = this.state.segments[i];      
      items[segment.row * this.rows + segment.column] = <Item className={this.classNames({
        'head' : snakeLength - 1 === i,
        'tail' : snakeLength > 1 && i === 0,
        'body' : snakeLength > 2 && i !== 0 && snakeLength - 1 !== i,
        'snake': true})}></Item>;
    }

    return items;
  }

  getNRandom = () => {
    let a = []; for(let i = 0; i < this.blocks; i++) { a.push(this.getRandomCell())} return a
  }

  render() : any {
    const myStyle : any = {
      'grid-template-columns': `repeat(${this.columns}, 30px)`,
      'grid-template-rows': `repeat(${this.rows}, 30px)`,
   }
    return <div className='playground-wrapper'>
      <Record enemies={this.blocks} rows={this.rows} columns={this.columns} feed={this.state.segments.length - 1} />
      <div style={myStyle} className={`dir-${this.state.direction} playground`}>        
        { this.draw() }
      </div>
    </div>
  }

  classNames(classes: Record<string, boolean>) {
    const toBeClasses = Object.keys(classes).map((key) =>
      classes[key] === true ? key : '',
    );
    return toBeClasses.join(' ');
  }
}

export default App;
