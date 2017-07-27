import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import crypto from 'crypto'
import _ from 'lodash'
import io from 'socket.io-client';

import Ionicon from 'react-ionicons'

import './trade.css'
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time 
import moment from 'moment'
import Rectangle from 'react-rectangle';

import { createOrder } from '../../actions/orderAction'
import { getOrderbook, getTrades, setOrderbook } from '../../actions/orderbookAction'



const apiKey= "R64K6T7xXgkqLo6RR7DiEpHp"
const apiSecret = "Fiz84qGUh07GMS9ZQpc-xmuE2YL09TloM5S_YZ8kJNwGnHv8"

const symbol = "XBTUSD"
const bigVolatilityUnit = 0.09 // indicates the volatility thats considered as a big price change

// var apiKey = "uu_HrKMeBX46fHD_WYrDLawr"
// var apiSecret = "e_vlkWgBJVh4idSDKYEjZvBO4RE2gNd-DnowgVhVqzKlEDfS";





class Trade extends Component {

   constructor(props) {
      super(props);

      let orders = {
         bids: {},
         asks: {}
      }
      
      this.state = {
         side: 'buy', // default buy
         type: 'limit', // default
         position: [],
         orderType: 'bid',
         address: '',
         orders,
         amount: 0,
         simpleView: true,
         deltaPosition: {
            x: 0, y: 0
         },
         isFirst: {
            order: true,
            position: true,
            margin: true
         },
         tab: 'position',
         isLocked: true // used for locking and unlocking the screen
      }
      this._handleAmountChange = this._handleAmountChange.bind(this);
      this._handlePriceChange = this._handlePriceChange.bind(this);

      this._handleQuantityChange = this._handleQuantityChange.bind(this);
      this._handleNewPriceChange = this._handleNewPriceChange.bind(this);
      this._handleIdChange = this._handleIdChange.bind(this);
      this._handleLeverageChange = this._handleLeverageChange.bind(this);
      this._handleKeyboard = this._handleKeyboard.bind(this);
      this._handlePinChange = this._handlePinChange.bind(this);
      this._handleSideChange = this._handleSideChange.bind(this);
      this._handleTypeChange = this._handleTypeChange.bind(this);

   }

   componentWillMount () {
      window.scrollTo(0, 0)
      // this.props.dispatch(getOrderbook())
      this.props.dispatch(getTrades())
      const socket = io('http://35.158.6.83/realtime', {
         query: {
            token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGlAYWxpLmNvbSIsImlzcyI6ImJpdGhvbGxhLmNvbSIsImV4cGlyeSI6MTUwMTA4MDM4NzcwOCwiaWF0IjoxNTAxMDgwMzg3fQ.7aORI0an_Yym6WFAB261yky4WiQaKpx7888sIzid_Z4'
         }
      })

      socket.on('orderbook', (data) => {
         this.props.dispatch(setOrderbook(data))
      });
   }

   componentWillUnmount() {

   }

   _handleAmountChange(event) {
      console.log(event.target.value)
      this.setState({amount: event.target.value});
   }

   _handlePriceChange(event) {
      this.setState({price: event.target.value});
   }

   _handleSideChange(event) {
      this.setState({side: event.target.value});
   }

   _handleTypeChange(event) {
      this.setState({type: event.target.value});
   }

   _handleQuantityChange(event){
      this.setState({quantity: event.target.value})
   }

   _handleNewPriceChange(event){
      this.setState({newPrice: event.target.value})
   }

   _handleIdChange(event){
      this.setState({orderID: event.target.value})
   }

   _handleLeverageChange(event){
      this.setState({leverage: event.target.value})
   }

   _handlePinChange(event) {
      if(event.target.value == '1234') {
         this.setState({
            isLocked: false
         })
      } else {
         this.setState({
            isLocked: true 
         })
      }
   }

   _handleKeyboard(event) {
      // event.preventDefault()
      // console.log(event)
      let key = event.key.toUpperCase()
      switch(key) {
         case 'F1':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {

            }
            break
         case 'F2':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               
            }
            break
         case 'F3':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._shaveOrder('asks')
            }
            break
         case 'F4':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._bestLimit('bids')
            }
            
            break
         case 'F5':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._marketOrder('Sell')
            }
            
            break
         case 'F8':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._marketOrder('Buy')
            }
            
            break
         case 'F9':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._bestLimit('asks')
            }
            break
          case 'F10':
            event.preventDefault()
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               this._shaveOrder('bids')
            }
            break
         case 'C':
            if(this.state.isLocked) {
               this._isLockedAlert()
            } else {
               if(this.props.order.activeOrders.length > 0) {
                  this._cancelOrder(this.props.order.activeOrders[0].orderID)
               }
            }
            break
      }
   }

   _isLockedAlert() {
      alert('Your xray console is locked. Please unlock it in order to proceed.')
   }

   _marketOrder(side) {
      this._createMarketOrder(side, "Market", Number(this.state.amount))
   }

   _bestLimit(type) {
      let price = 0
      let side = 'Buy'
      if(type === 'bids') {
         side = 'Sell'
         price = Number(this.props.orderbook[type][0][0])
      } else if(type === 'asks') {
         side = 'Buy'
         price = Number(this.props.orderbook[type][0][0])
      }
      this._createOrder(side, price, "Limit", Number(this.state.amount))
   }

   _shaveOrder(type) {
      let price = 0
      let side = 'Buy'
      if(type === 'bids') {
         side = 'Buy'
         price = Number(this.props.orderbook[type][0][0]) + 0.1
      } else if(type === 'asks') {
         side = 'Sell'
         price = Number(this.props.orderbook[type][0][0]) - 0.1
      }
      this._createOrder(side, Number(price), "Limit", Number(this.state.amount))
   }

   _fillEmptySlots(bids, type, i=0) {
      // console.log(i + ' ' + type)
      if(i==bids.length-1) {
         // console.log(bids)
         let obj = {}
         obj[type] = bids
         this.setState(obj)
         return bids
      } else {
         let bid = Number(bids[i][0])
         if(Math.abs(Number(bids[i][0]) - Number(bids[i+1][0])) > 0.11) {
            let price
            if(type == 'bids') {
               price = _.round(bid - 0.1, 1)
            } else {
               price = _.round(bid + 0.1, 1)
            }
            bids.splice(i+1, 0, [price, "0"])
            // i++
         }
         this._fillEmptySlots(bids, type, i+1)
      }
   }

   _createMarketOrder(side, ordType, orderQty) {
      this.props.dispatch(createOrder(symbol, side, ordType, orderQty))   
   }

   _createOrder(side, price, ordType, orderQty) {
      this.props.dispatch(createOrder(symbol, side, ordType, orderQty, price))
   }

   _clickOrder2() {
      let amount = this.state.amount
      let price = this.state.price
      let side = this.state.side
      let type = this.state.type

      this.props.dispatch(createOrder(side, type, Number(amount), price))
   }

   _clickOrder(type, cell, i) {

      let amount = this.state.amount
      let price = this.props.orderbook[cell][i][0]

      var side = "" //better to assign type to this variable, however bitmex api is case sensitive. will have a look at it later
      var ordType = ""
      var orderQty = amount

      if(type === "sell" && cell === "asks") {
            // limit sell
            side = "Sell"
            ordType = "Limit"
            this.state.orders[cell][price] = {id: 1, amount: amount}
            this.setState({
                  orders: this.state.orders
            })
      } else if(type === "sell" && cell === "bids") {
            // market sell
            side = "Sell"
            ordType = "Limit"
      } else if(type === "buy" && cell === "asks") {
            // market buy
            side = "Buy"
            ordType = "Limit"
      } else if(type === "buy" && cell === "bids") {
            // limit buy
            side = "Buy"
            ordType = "Limit"

            let order = {}
            order[amount] = ""
            this.state.orders[cell][price] = {id: 1, amount: amount}
            this.setState({
                  orders: this.state.orders
            })
      }
      this._createOrder(side, Number(price), ordType, Number(orderQty))
   }


   _handleDrag(e, ui, price) {
      if(ui.x > 40) {
         this.state.orders.bids[price] = null
         this.setState({
            orders: this.state.orders
         })
      }
      // this.setState({
      //    deltaPosition: {
      //       x: x + ui.deltaX,
      //       y: y + ui.deltaY,
      //    }
      // });
   }

   _drawPositionTable() {
      var rows = [];

      for(let i=this.props.position.positions.length-1; i>=0; i--) {
         rows.push(
            <tr key={'position' + i}>
               <td>{(this.props.position.positions[i].symbol)}</td>
               <td>{(this.props.position.positions[i].currentQty)}</td>
               <td>{(this.props.position.positions[i].avgEntryPrice) ? (this.props.position.positions[i].avgEntryPrice).toFixed(2) : null}</td>
               <td>{(this.props.position.positions[i].markPrice)}</td>
               <td>{(this.props.position.positions[i].liquidationPrice)}</td>
               <td>{(this.props.position.positions[i].realisedPnl / 100000000).toFixed(4)}</td>
               <td>{(this.props.position.positions[i].unrealisedPnl / 100000000).toFixed(4)}</td>
            </tr>     
         )
      }
      var table = 
      <table className="text-center header-table">
         <thead>
            <tr>
               <th className="text-center">SYMBOL</th>
               <th className="text-center">SIZE</th>
               <th className="text-center">ENTRY PRICE</th>
               <th className="text-center">MARKET PRICE</th>
               <th className="text-center">LIQUIDATION PRICE</th>
               <th className="text-center">REALIZED P/L</th>
               <th className="text-center">UNREALIZED P/L</th>
            </tr>
         </thead>
         <tbody>
            {rows}
         </tbody>
      </table>
      return table;
   }

   _drawTable() {
      switch(this.state.tab) {
         case 'position':
             return this._drawPositionTable()
            break
         case 'order':
            return this._drawOrderTable()
            break
         default:
            break
      }
   }

   _drawOrderbook() {
      var rows = [];
      let bidsLength = this.props.orderbook.bids.length
      let asksLength = this.props.orderbook.asks.length

      let maxAmount = 0 // largest acummulative size on both bids and asks side which is used for drawing rectanlgular price indicators
      if(this.props.orderbook.bids[bidsLength-1][2] > this.props.orderbook.asks[asksLength-1][2]) {
         maxAmount = this.props.orderbook.bids[bidsLength-1][2]
      } else {
         maxAmount = this.props.orderbook.asks[asksLength-1][2]
      }

      for(let i=this.props.orderbook.asks.length-1; i>=0; i--) {
         let fill = this.props.orderbook.asks[i][2]/maxAmount * 100 + "%"
         rows.push(
            <tr key={this.props.orderbook.asks[i][0]}>
               <td className="col-ask-order" onClick={() => this._clickOrder('sell', 'asks', i)}>{(this.state.orders.asks[this.props.orderbook.asks[i][0]] != null)? 
                  <Draggable
                     onStop={(e, ui) => this._handleDrag(e, ui, this.props.orderbook.asks[i][0])}>
                     <div>
                        {this.state.orders.asks[this.props.orderbook.asks[i][0]].amount}
                     </div>
                  </Draggable>
               : null}
               </td>
               <td className="">{this.props.orderbook.asks[i][1]}</td>
               <td className="ask">{this.props.orderbook.asks[i][0]}</td>
               <td>
                  <Rectangle aspectRatio={[9, 1]}>
                     <div className="ask-fill" style={{width: fill, height: '90%'}} />
                  </Rectangle>
               </td>
               <td className="col-bid-order" onClick={() => this._clickOrder('buy', 'asks', i)}></td>
            </tr>
         )        
      }
      let priceIndicator = {}
      // if(this.props.orderbook.trades[0].side == 'Buy') {
         priceIndicator.color = '#00e500'
      // } else {
         priceIndicator.color = '#ff0000'
      // }
      // if(this.props.orderbook.trades[1]) {
      //    if(this.props.orderbook.trades[0].price - this.props.orderbook.trades[1].price >= bigVolatilityUnit) {
      //       priceIndicator.type = "ion-arrow-up-b"
      //    } else if(this.props.orderbook.trades[1].price - this.props.orderbook.trades[0].price >= bigVolatilityUnit) {
      //       priceIndicator.type = "ion-arrow-down-b"
      //    }
      // }
      rows.push(
         <tr key="price" className="borderTop">
            <td className="col-ask-order"></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="col-bid-order"></td>
         </tr>
      )
      for(let i=0; i<this.props.orderbook.bids.length; i++) {
         let fill = this.props.orderbook.bids[i][2]/maxAmount * 100 + "%"
         let borderStyle = {} // border t seperate bids and asks
         if(i == 0) {
            borderStyle = {
               "borderTop": "1px solid white"
            }
         }
         else {
            borderStyle = {}
         }
         rows.push(
            <tr style={borderStyle} key={this.props.orderbook.bids[i][0]}>
               <td className="col-ask-order" onClick={() => this._clickOrder('sell', 'bids', i)}></td>
               <td>
                  <Rectangle aspectRatio={[9, 1]}>
                     <div className="bid-fill" style={{width: fill, height: '90%', float: 'right'}} />
                  </Rectangle>
               </td>
               <td className="bid">{this.props.orderbook.bids[i][0]}</td>
               <td className="">{this.props.orderbook.bids[i][1]}</td>
               <td className="col-bid-order" onClick={() => this._clickOrder('buy', 'bids', i)}>{(this.state.orders.bids[this.props.orderbook.bids[i][0]] != null)?

                  <Draggable
                     onStop={(e, ui) => this._handleDrag(e, ui, this.props.orderbook.bids[i][0])}>
                     <div>
                        {this.state.orders.bids[this.props.orderbook.bids[i][0]].amount}
                     </div>
                  </Draggable>
               : null}
               </td>
            </tr>
         )        
      }
      return rows
   }

   _drawTrades() {
      const maxRow = 20
      let length = this.props.orderbook.trades.length
      if(length > maxRow) {
         length = maxRow
      }
      var rows = [];
      for(let i=0; i<length; i++) {
         let priceIndicatorClass = ""
         let icon = {}

         let iconColor = "black"
         if(this.props.orderbook.trades[i+1]) {
            if(this.props.orderbook.trades[i].price - this.props.orderbook.trades[i+1].price >= bigVolatilityUnit) {
               icon = {
                  type: "ion-arrow-up-b",
                  color: "black",
               }
               priceIndicatorClass = "bid-fill-indicator"
            } else if(this.props.orderbook.trades[i+1].price - this.props.orderbook.trades[i].price >= bigVolatilityUnit) {
               icon = {
                  type: "ion-arrow-down-b",
                  color: "white"
               }
               priceIndicatorClass = "ask-fill-indicator"
            }
         }
         let fill = this.props.orderbook.trades[i].size / this.props.orderbook.largestTrade * 100 + '%' // fill rectangles based on percentage
         let className = ""
         if(this.props.orderbook.trades[i].side == 'Buy') {
            className = "bid"
            icon.style= {backgroundColor: '#00e500'}
         } else {
            className = "ask"
            icon.style= {backgroundColor: '#ff0000'}
         }
         rows.push(
            <tr key={i} className={className}>
               <td style={{width: "40%"}} className={priceIndicatorClass}><Ionicon icon={icon.type} fontSize="1rem" color={icon.color}/>{this.props.orderbook.trades[i].price}</td>
               <td style={{width: "15%"}}>
                  <Rectangle aspectRatio={[3, 1]}>
                     <div className={className + "-fill"} style={{width: fill, height: '100%'}} />
                  </Rectangle>
               </td>
               <td style={{width: "25%"}}>{this.props.orderbook.trades[i].size}</td>
               <td style={{width: "25%"}}>{moment(this.props.orderbook.trades[i].timestamp).format('HH:mm:ss')}</td>               
            </tr>
         )        
      }
      return rows
   }

   render() {
      const currency = 'USD'
      let bidClass, askClass
      if(this.state.orderType === 'bid') {
         bidClass = 'bg-faded'
         askClass= ''
      } else {
         bidClass = ''
         askClass = 'bg-faded'
      }
      return(
         <div className="container-fluid">
            <div className="row">
               <div className="col-12">
                  <table className="header-table">
                     <tr>
                        <td>
                           <select onChange={this._handleTypeChange}>
                              <option value="limit">limit</option>
                              <option value="market">market</option>
                           </select>
                        </td>
                        <td>
                           <select onChange={this._handleSideChange}>
                              <option value="buy">buy</option>
                              <option value="sell">sell</option>
                           </select>
                        </td>
                        <td><input type="text" placeholder="amount" onChange={this._handleAmountChange}/></td>
                        <td><input type="text" placeholder="price" onChange={this._handlePriceChange}/></td>
                        <td><button onClick={this._clickOrder2.bind(this)}>confirm</button></td>
                     </tr>
                  </table>
               </div>
            </div>
            <div className="row">
               <div className="col-9">
                  <table className="text-center orderbook-table">
                     <tbody>
                        {(this.props.orderbook.bids && this.props.orderbook.bids.length && this.props.orderbook.asks && this.props.orderbook.asks.length > 0)?
                        this._drawOrderbook():
                        null
                        }
                     </tbody>
                  </table>
               </div>
               <div className="col-3">
                  <table className="trade-table">
                     <tbody>
                        {(this.props.orderbook.trades && this.props.orderbook.trades.length > 0)?
                        this._drawTrades():
                        null
                        }
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      )
   }
}

function mapStateToProps(store) {
   return {
      exchange: store.exchange,
      user: store.user,
      order: store.order,
      margin: store.margin,
      position: store.position,
      orderbook: store.orderbook
   };
}

export default connect(mapStateToProps)(Trade);
