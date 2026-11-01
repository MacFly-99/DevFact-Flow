import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// On définit les styles (c'est du CSS-in-JS, mais version PDF)
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#333" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000" },
  subtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  infoBlock: { width: "45%" },
  infoLabel: { fontSize: 9, color: "#666", textTransform: "uppercase", marginBottom: 4 },
  infoText: { fontSize: 11, marginBottom: 2 },
  table: { width: "100%", marginBottom: 30 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 8 },
  colDescription: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  textBold: { fontWeight: "bold" },
  totalsSection: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  totalsBox: { width: "40%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#ccc", marginTop: 4 },
  grandTotalText: { fontSize: 14, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#999", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 }
});

type PdfDocumentProps = {
  type: "DEVIS" | "FACTURE";
  number: string;
  date: string;
  dueDate?: string;
  status: string;
  client: {
    name: string;
    companyName?: string | null;
    email: string;
    phone?: string | null;
    address?: string | null;
  };
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
  total: number;
};

export function PdfDocument({ type, number, date, dueDate, status, client, items, total }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{type}</Text>
            <Text style={styles.subtitle}>#{number}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.infoText}>Date : {date}</Text>
            {dueDate && <Text style={styles.infoText}>Échéance : {dueDate}</Text>}
            <Text style={[styles.infoText, { marginTop: 4, textTransform: "uppercase", fontWeight: "bold" }]}>
              Statut : {status}
            </Text>
          </View>
        </View>

        {/* Infos Client */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Émis par</Text>
            <Text style={[styles.infoText, styles.textBold]}>DevFact Flow</Text>
            <Text style={styles.infoText}>contact@devfact-flow.com</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Facturé à</Text>
            {client.companyName && <Text style={[styles.infoText, styles.textBold]}>{client.companyName}</Text>}
            <Text style={styles.infoText}>{client.name}</Text>
            <Text style={styles.infoText}>{client.email}</Text>
            {client.phone && <Text style={styles.infoText}>{client.phone}</Text>}
          </View>
        </View>

        {/* Tableau */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, styles.textBold]}>Description</Text>
            <Text style={[styles.colQty, styles.textBold]}>Qté</Text>
            <Text style={[styles.colPrice, styles.textBold]}>Prix Unitaire</Text>
            <Text style={[styles.colTotal, styles.textBold]}>Total HT</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.unitPrice.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{(item.quantity * item.unitPrice).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text>Sous-total</Text>
              <Text>{total.toFixed(2)} €</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalText}>Total</Text>
              <Text style={styles.grandTotalText}>{total.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          DevFact Flow - L'outil de devis et facturation ultra pro. Merci de votre confiance.
        </Text>
      </Page>
    </Document>
  );
}