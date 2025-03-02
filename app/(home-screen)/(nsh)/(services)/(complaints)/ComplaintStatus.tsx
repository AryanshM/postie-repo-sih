import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
} from "react-native";
import Headers from "@/components/Headers";
import { useRouter } from "expo-router";
import ComplaintCard from "./ComplaintCard";
import resolvedIcon from "./resolvedIcon.png";
import unresolvedIcon from "./unresolvedIcon.png";
import transferredIcon from "./transferredIcon.png";

const ListOfComplaints = () => {
  const router = useRouter();
  const [active, setActive] = useState("unresolved");
  const [complaintsData, setComplaintsData] = useState({
    pending_complains: [
      {
        complain_id: 52690109,
        consignment_id: 10976809,
        created_on: "2024-12-11T06:06:52.932617Z",
        complain: "Not received",
        status: "pending",
        routes: {
          spo_start: {
            id: 9500,
            name: "31 Bn PAC Rudarpur S.O",
          },
          hpo_start: {
            id: 307,
            name: "Haldwani H.O",
          },
          ich_start: {
            id: 757,
            name: "RUDARPRAYAG",
          },
          nsh_start: {
            id: 98,
            name: "DHERADUN NSH",
          },
          nsh1: {
            id: 99,
            name: "DHERADUN NSH",
          },
          nsh2: {
            id: 94,
            name: "AGRA NSH",
          },
          nsh_end: {
            id: 95,
            name: "AGRA NSH",
          },
          ich_end: {
            id: 722,
            name: "JHANSI",
          },
          hpo_end: {
            id: 244,
            name: "Ghaziabad H.O",
          },
          spo_end: {
            id: 8122,
            name: "Arya Nagar S.O (Ghaziabad)",
          },
        },
      },
      {
        complain_id: 52690107,
        consignment_id: 93822048,
        created_on: "2024-12-11T10:18:28.010364Z",
        complain: "Lost in HPO",
        status: "pending",
        routes: {
          spo_start: {
            id: 9540,
            name: "31 Bn PAC Rudarpur S.O",
          },
          hpo_start: {
            id: 327,
            name: "Haldwani H.O",
          },
          ich_start: {
            id: 751,
            name: "RUDARPRAYAG",
          },
          nsh_start: {
            id: 99,
            name: "DHERADUN NSH",
          },
          nsh1: {
            id: 91,
            name: "DHERADUN NSH",
          },
          nsh2: {
            id: 93,
            name: "AGRA NSH",
          },
          nsh_end: {
            id: 92,
            name: "AGRA NSH",
          },
          ich_end: {
            id: 721,
            name: "JHANSI",
          },
          hpo_end: {
            id: 243,
            name: "Ghaziabad H.O",
          },
          spo_end: {
            id: 812,
            name: "Arya Nagar S.O (Ghaziabad)",
          },
        },
      },
    ],
    resolved_complains: [
      {
        complain_id: 98234106,
        consignment_id: 73210098,
        created_on: "2024-12-10T15:30:25.612617Z",
        resolved_on: "2024-12-11T10:00:00.000000Z",
        complain: "Delayed delivery",
        status: "resolved",
      },
    ],
    transferred_complains: [
      {
        complain_id: 34567219,
        consignment_id: 41289674,
        created_on: "2024-12-10T08:45:00.923124Z",
        transferred_on: "2024-12-11T09:15:00.000000Z",
        complain: "Transferred to Delhi NSH",
        status: "transferred to Dehradun NSH",
      },
    ],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentComplaintId, setCurrentComplaintId] = useState(null);

  const handleResolve = (complaintId) => {
    // Handle resolve logic
  };

  const handleTransfer = (complaintId, transferStation) => {
    setComplaintsData((prevData) => {
      const updatedPending = prevData.pending_complains.filter(
        (complaint) => complaint.complain_id !== complaintId
      );
      const transferredComplaint = prevData.pending_complains.find(
        (complaint) => complaint.complain_id === complaintId
      );

      if (transferredComplaint) {
        transferredComplaint.status = `transferred to ${transferStation   }`;
        transferredComplaint.transferred_on = new Date().toISOString();
        transferredComplaint.transferred_to = transferStation;
        return {
          ...prevData,
          pending_complains: updatedPending,
          transferred_complains: [
            ...prevData.transferred_complains,
            transferredComplaint,
          ],
        };
      }

      return prevData;
    });
    setModalVisible(false);
  };

  const openTransferModal = (complaintId) => {
    setCurrentComplaintId(complaintId);
    setModalVisible(true);
  };

  const complaints =
    active === "unresolved"
      ? complaintsData.pending_complains
      : active === "resolved"
        ? complaintsData.resolved_complains
        : complaintsData.transferred_complains;

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      className="bg-screenBackgroundColor flex-1 px-4"
    >
      <View className="flex-1 bg-screenBackgroundColor px-4">
        <View className="px-12">
          <Headers
            heading="Complaints"
            back={() => router.replace("/(home-screen)/(nsh)/(tabs)/Home")}
          />
        </View>

        {/* Filter buttons */}
        <View className="flex-row">
          <TouchableOpacity onPress={() => setActive("unresolved")}>
            <View style={{ alignItems: "center" }} className="m-6 p-6">
              <Image
                source={unresolvedIcon}
                style={{ width: 30, height: 30 }}
              />
              <Text>Unresolved</Text>
              <View
                style={{
                  width: active === "unresolved" ? "70%" : "0%",
                  height: "3%",
                  backgroundColor: "red",
                  marginVertical: 4,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActive("resolved")}>
            <View style={{ alignItems: "center" }} className="m-6 p-6">
              <Image source={resolvedIcon} style={{ width: 30, height: 30 }} />
              <Text>Resolved</Text>
              <View
                style={{
                  width: active === "resolved" ? "70%" : "0%",
                  height: "3%",
                  backgroundColor: "red",
                  marginVertical: 4,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActive("transferred")}>
            <View style={{ alignItems: "center" }} className="m-6 p-6">
              <Image
                source={transferredIcon}
                style={{ width: 30, height: 30 }}
              />
              <Text>Transferred</Text>
              <View
                style={{
                  width: active === "transferred" ? "70%" : "0%",
                  height: "3%",
                  backgroundColor: "red",
                  marginVertical: 4,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* List of complaints */}
        {complaints.length > 0 ? (
          complaints.map((complaint, index) => (
            <ComplaintCard
              key={`${complaint.complain_id}-${index}`} // Unique key combining complain_id and index
              complaintId={complaint.complain_id}
              consignmentId={complaint.consignment_id}
              createdOn={complaint.created_on}
              status={complaint.status}
              onResolve={() => handleResolve(complaint.complain_id)}
              onTransfer={() => openTransferModal(complaint.complain_id)}
            />
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#666" }}>
            No complaints to display.
          </Text>
        )}
      </View>

      {/* Transfer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text>Select Route to Transfer</Text>
            <View>
              {/* Map through routes and display them */}
              {complaintsData.pending_complains.find(
                (complaint) => complaint.complain_id === currentComplaintId
              )?.routes
                ? Object.keys(
                    complaintsData.pending_complains.find(
                      (complaint) =>
                        complaint.complain_id === currentComplaintId
                    ).routes
                  ).map((routeKey) => {
                    const route = complaintsData.pending_complains.find(
                      (complaint) =>
                        complaint.complain_id === currentComplaintId
                    ).routes[routeKey];
                    return (
                      <TouchableHighlight
                        key={route.id}
                        onPress={() => {
                          setSelectedRoute(route.name);
                          handleTransfer(currentComplaintId, route.name);
                        }}
                      >
                        <Text className="p-4">{route.name}</Text>
                      </TouchableHighlight>
                    );
                  })
                : null}
            </View>
            <TouchableHighlight
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <View className="h-96"></View>
    </ScrollView>
  );
};

export default ListOfComplaints;
