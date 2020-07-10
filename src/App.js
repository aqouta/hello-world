import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core'
import CSVReader from 'react-csv-reader'
import numeral from 'numeral'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import {CSVLink} from 'react-csv'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function App() {

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const headers = [{label:'Start Date',key:'StartDate'},
  {label:'End Date',key:'EndDate'},
  {label:'Portfolio Name',key:'PortfolioName'},
  {label:'Currency',key:'Currency'},
  {label:'Campaign Name',key:'CampaignName'},
  {label:'Ad Group Name',key:'AdGroupName'},
  {label:'Customer Search Term',key:'CustomerSearchTerm'},
  {label:'Impressions',key:'Impressions'},
  {label:'Clicks',key:'Clicks'},
  {label:'Click Through Rate',key:'ClickThruRate'},
  {label:'Cost Per Click',key:'CostPerClick'},
  {label:'Spend',key:'Spend'},
  {label:'Seven Day Total Sales',key:'SevenDayTotalSales'},
  {label:'Total Advertising Cost of Sales',key:'TotalAdvertisingCostofSales'},
  {label:'Total Return on Advertising Spend',key:'TotalReturnonAdvertisingSpend'},
  {label:'Seven Day Total Orders',key:'SevenDayTotalOrders'},
  {label:'Seven Day Total Units',key:'SevenDayTotalUnits'},
  {label:'Seven Day Conversion Rate',key:'SevenDayConversionRate'},
  {label:'Seven Day Advertised SKU Units',key:'SevenDayAdvertisedSKUUnits'},
  {label:'Seven Day Other SKU Units',key:'SevenDayOtherSKUUnits'},
  {label:'Seven Day Advertised SKU Sales',key:'SevenDayAdvertisedSKUSales'},
  {label:'Seven Day Other SKU Sales',key:'SevenDayOtherSKUSales'},  
  {label:'total Spend Weight',key:'totalSpendWeight'},
  {label:'total Order Weight',key:'totalOrderWeight'},
  {label:'total Weight',key:'totalWeight'},
  {label:'total Impression Weight',key:'totalImpressionWeight'},
  {label:'total ROAS Weight',key:'totalROASWeight'},
  {label:'total Click Weight',key:'totalClickWeight'},]

  const [rawInput, setRawInput] = useState([])
  const [rows, setRows] = useState([])
  const [weights, setWeights] = useState([{columnKey:'TotalReturnonAdvertisingSpend',maximum:'30',multiplier:'.06'},
      {columnKey:'SevenDayTotalOrders',maximum:'30',multiplier:'.06'},
      {columnKey:'Clicks',maximum:'10',multiplier:'.02'},
      {columnKey:'Impressions',maximum:'10',multiplier:'.002'},
      {columnKey:'Spend',maximum:'20',multiplier:'.008'}])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(()=>{
    console.log({weights})
  },[weights])

  useEffect(() => {
    rawInput.shift();
    //console.log({rawInput,rawInput.shift()})
    let structureList = rawInput.map(row => {
      let zeroOrders = false;

      let totalROASWeight = 0;
      let totalROAS = numeral(row[16]).value()

      let totalOrderWeight = 0;
      let totalOrders = numeral(row[17]).value()

      let totalClickWeight = 0;
      let totalClicks = numeral(row[10]).value()

      let totalImpressionWeight = 0;
      let totalImpressions = numeral(row[9]).value()

      let totalSpendWeight = 0;
      let totalSpend = numeral(row[13]).value()

      let totalWeight = 0;


      if (totalROAS >= 5)
        totalROASWeight = 0.3
      else {
        totalROASWeight = totalROAS ? totalROAS * 0.06 : 0
      }
      if (totalOrders > 5)
        totalOrderWeight = 0.3;
      else if (totalOrders < 1) {
        totalOrderWeight = 0
        zeroOrders = true
      } else {
        totalOrderWeight = totalOrders ? totalOrders * 0.06 : 0
      }
      if (totalClicks > 5)
        totalClickWeight = 0.1;
      else {
        totalClickWeight = totalClicks ? totalClicks * 0.02 : 0
      }
      if (totalImpressions > 50)
        totalImpressionWeight = 0.1;
      else {
        totalImpressionWeight = totalImpressions ? totalImpressions * 0.002 : 0
      }
      if (totalSpend > 25)
        totalSpendWeight = 0.2;
      else {
        totalSpendWeight = totalSpend ? totalSpend * 0.008 : 0
      }

      let ZeroOrderWeight = 1;
      if (zeroOrders)
        ZeroOrderWeight *= -1
      let orderDependantWeights = (totalClickWeight + totalImpressionWeight+totalSpendWeight) * ZeroOrderWeight

      totalWeight = totalOrderWeight + totalROASWeight + orderDependantWeights



      return {
        StartDate: row[0],
        EndDate: row[1],
        PortfolioName: row[2],
        Currency: row[3],
        CampaignName: row[4],
        AdGroupName: row[5],
        Targeting: row[6],
        MatchType: row[7],
        CustomerSearchTerm: row[8],
        Impressions: row[9],
        Clicks: row[10],
        ClickThruRate: row[11],
        CostPerClick: row[12],
        Spend: row[13]?numeral(row[13]).value().toFixed(2):0,
        SevenDayTotalSales: row[14],
        TotalAdvertisingCostofSales: row[15],
        TotalReturnonAdvertisingSpend: row[16],
        SevenDayTotalOrders: row[17],
        SevenDayTotalUnits: row[18],
        SevenDayConversionRate: row[19],
        SevenDayAdvertisedSKUUnits: row[20],
        SevenDayOtherSKUUnits: row[21],
        SevenDayAdvertisedSKUSales: row[22],
        SevenDayOtherSKUSales: row[23],
        totalSpendWeight: totalSpendWeight.toFixed(2),
        totalOrderWeight: totalOrderWeight.toFixed(2),
        totalWeight: totalWeight?totalWeight.toFixed(2):0,
        totalImpressionWeight: (totalImpressionWeight*ZeroOrderWeight).toFixed(2),
        totalROASWeight:(totalROASWeight*ZeroOrderWeight).toFixed(2),
        totalClickWeight:(totalClickWeight*ZeroOrderWeight).toFixed(2)
      }

    })
    setRows(structureList);
  }, [rawInput])




  const classes = useStyles();
  return (
    <div>
      <Dialog 
        title="Weight lifting" 
        fullWidth={true}
        maxWidth={'md'}
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      >
        <DialogTitle id="customized-dialog-title" onClose={() => setDialogOpen(false)}>
          Weight Lifting
        </DialogTitle>
        <DialogContent>
          <div>
            <Button onClick={()=>{setWeights([...weights,{columnKey:null,multiplier:null,maximum:null}])}}>Add Weight</Button>
            <div style={{paddingLeft:'10px',display:'flex'}}>
              <div style={{width:'320px',display:'flex'}}><div>Column</div></div>
              <div style={{width:'50px',display:'flex'}}><div>multiplier</div></div>
              <div style={{width:'50px',paddingLeft:'40px',display:'flex'}}><div>maximum(%)</div></div>
            </div>
            <div>
              {weights.map((weight,index) => {
                return (
                  <div style={{paddingLeft:'10px'}}>
                    <Select
                      style={{width:'280px'}}                      
                      value={weight.columnKey}
                      onChange={event => { 
                        const tWeights = weights;
                        tWeights[index].columnKey = event.target.value
                        setWeights(tWeights)
                        console.log({weights})
                      }}
                    >
                      {headers.map(row => {
                        return (<MenuItem value={row.key}>{row.label}</MenuItem>)
                      })}
                    </Select>
                    <TextField 
                      value={weight.multiplier}
                      onChange={event=>{setWeights(prev=>{
                          prev[index].multiplier = event.target.value
                          return prev
                        })}} 
                      style={{width:'80px',paddingLeft:'40px'}} />
                    <TextField 
                      value={weight.maximum}
                      onChange={event=>{setWeights(prev=>{
                        prev[index].maximum = event.target.value
                        return prev
                      })}} 
                      style={{width:'80px',paddingLeft:'40px'}} 
                    />
                    <Button style={{paddingLeft:'20px'}} >Remove</Button>
                  </div>
                )

              })}
            </div>

          </div>
        </DialogContent>
      </Dialog>
      <CSVReader onFileLoaded={(data, fileInfo) => setRawInput(data)} />
      <CSVLink  data={rows} headers={headers}>export CSV</CSVLink>
      <Button onClick={()=>setDialogOpen(!dialogOpen)}>Change Weights</Button>
      <TableContainer style={{maxHeight:800}} component={Paper}>
      <Table stickyHeader className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Search Term</b></TableCell>
            <TableCell><b>Targeting</b></TableCell>
            <TableCell><b>Portfolio Name</b></TableCell>
            <TableCell><b>ROAS</b></TableCell>
            <TableCell><b>Total Orders</b></TableCell>
            <TableCell><b>Clicks</b></TableCell>
            <TableCell><b>Impression</b></TableCell>
            <TableCell><b>Spend</b></TableCell>
            <TableCell><b>total ROAS weight</b></TableCell>
            <TableCell><b>total orders weight</b></TableCell>
            <TableCell><b>total clicks weight</b></TableCell>
            <TableCell><b>total impression weight</b></TableCell>
            <TableCell><b>total spend weight</b></TableCell>
            <TableCell><b>total weight</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.sort((a,b)=>{return b.totalWeight-a.totalWeight}).map((row) => (
            <TableRow key={row.CustomerSearchTerm}>
              <TableCell align="right">{row.CustomerSearchTerm}</TableCell>
              <TableCell align="right">{row.Targeting}</TableCell>
              <TableCell align="right">{row.PortfolioName}</TableCell>
              <TableCell align="right">{row.TotalReturnonAdvertisingSpend}</TableCell>
              <TableCell align="right">{row.SevenDayTotalOrders}</TableCell>
              <TableCell align="right">{row.Clicks}</TableCell>
              <TableCell align="right">{row.Impressions}</TableCell>
              <TableCell align="right">{row.Spend}</TableCell>
              <TableCell align="right">{row.totalROASWeight ? row.totalROASWeight : 0}</TableCell>
              <TableCell align="right">{row.totalOrderWeight ? row.totalOrderWeight : 0}</TableCell>
              <TableCell align="right">{row.totalClickWeight ? row.totalClickWeight : 0}</TableCell>
              <TableCell align="right">{row.totalImpressionWeight ? row.totalImpressionWeight : 0}</TableCell>
              <TableCell align="right">{row.totalSpendWeight ? row.totalSpendWeight : 0}</TableCell>
              <TableCell align="right">{row.totalWeight}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default App;
