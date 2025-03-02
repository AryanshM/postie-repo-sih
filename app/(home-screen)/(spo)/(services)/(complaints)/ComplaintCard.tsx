import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ComplaintCard = ({
  complaintId,
  consignmentId,
  createdOn,
  status,
  onResolve,
  onTransfer,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        <Text style={styles.label}>Complaint ID:</Text> {complaintId}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Consignment ID:</Text> {consignmentId}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Created On:</Text> {new Date(createdOn).toLocaleString()}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Status:</Text> {status}
      </Text>

      {status === "pending" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resolveButton}
            onPress={() => onResolve(complaintId)}
          >
            <Text style={styles.buttonText}>Resolve</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.transferButton}
            onPress={() => onTransfer(complaintId, consignmentId)}
          >
            <Text style={styles.buttonText}>Transfer</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  resolveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  transferButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ComplaintCard;
