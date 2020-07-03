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
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

function App() {

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  const [rawInput, setRawInput] = useState([])
  const [rows, setRows] = useState([])
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
        totalSpendWeight = 0.1;
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
      <CSVReader onFileLoaded={(data, fileInfo) => setRawInput(data)} />
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
      {/* <table>
        <tr>
          <th><b>Search Term</b></th>
          <th><b>Targeting</b></th>
          <th><b>Portfolio Name</b></th>
          <th><b>ROAS</b></th>
          <th><b>Total Orders</b></th>
          <th><b>Clicks</b></th>
          <th><b>Impression</b></th>
          <th><b>Spend</b></th>
          <th><b>total ROAS weight</b></th>
          <th><b>total orders weight</b></th>
          <th><b>total clicks weight</b></th>
          <th><b>total impression weight</b></th>
          <th><b>total spend weight</b></th>
          <th><b>total weight</b></th>
        </tr>

        {rows.sort((a,b)=>{return b.totalWeight-a.totalWeight}).map(row => {
          return (
            <tr>
              <th>{row.CustomerSearchTerm}</th>
              <th>{row.Targeting}</th>
              <th>{row.PortfolioName}</th>
              <th>{row.TotalReturnonAdvertisingSpend}</th>
              <th>{row.SevenDayTotalOrders}</th>
              <th>{row.Clicks}</th>
              <th>{row.Impressions}</th>
              <th>{row.Spend}</th>
              <th>{row.totalROASWeight ? row.totalROASWeight : 0}</th>
              <th>{row.totalOrderWeight ? row.totalOrderWeight : 0}</th>
              <th>{row.totalClickWeight ? row.totalClickWeight : 0}</th>
              <th>{row.totalImpressionWeight ? row.totalImpressionWeight : 0}</th>
              <th>{row.totalSpendWeight ? row.totalSpendWeight : 0}</th>
              <th>{row.totalWeight}</th>

            </tr>
          )
        })}
      </table> */}

    </div>
  );
}

export default App;
