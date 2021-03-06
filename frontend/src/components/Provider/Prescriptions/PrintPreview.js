/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';
import '../../../scss/printPreview.scss';

export default function PrintPreview() {

  const { provider, vaccine, dosage, date, presuser } = useParams();
  const actualDate = new Date();

  return (
    <div className="page">
      <div className="subpage">
        <h1 className="mt-5">SanitAlly recept</h1>
        <table className="print-table">
          <thead>
            <tr>
              <th>Kiállítás dátuma</th>
              <th>Recept kiállítója</th>
              <th>Páciens neve</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{date}</td>
              <td>{provider}</td>
              <td>{presuser}</td>
            </tr>
          </tbody>
        </table>
        <h6>
          Önnek az alábbi gyógykészítmény kiváltására van jogosultsága:
        </h6>
        <table className="print-table">
          <thead>
            <tr>
              <th>Gyógyszer neve</th>
              <th>Előírt adagolás</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{vaccine}</td>
              <td>{dosage}</td>
            </tr>
          </tbody>
        </table>
        <div className="signature">______________________________</div>
        <p>Beteg aláírása ({presuser})</p>
        <div />
      </div>
      <div className="foot">SanitAlly Copyright {actualDate.getFullYear()}.</div>
    </div>
  )
}