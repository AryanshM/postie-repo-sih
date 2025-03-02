import { View } from "react-native";
import React from "react";
import ConsignmentCard from "../components/ConsignmentCard";

const TodaysConsignment = () => {
  const response = [
    {
      consignment_id: 105,
      created_at: "2024-12-07T10:28:50.819531Z",
      consignments: {
        consignment_id: 105,
        type: "document",
        service: "other",
        status: false,
        receiver: [
          {
            id: 100,
            first_name: "Aryansh",
            last_name: "Mishra",
            pincode: 110096,
            address: "Sbhzhx",
            city_district: "East Delhi",
            state: "Delhi",
            country: "India",
            phone_number: "9305898894",
            consignment_id: 105,
          },
        ],
      },
    },
  ];

  return (
    <View>
      {response.map((res) =>
        res.consignments.receiver.map((receiver) => (
          <ConsignmentCard
            key={res.consignment_id} // Consignment ID as the key
            id={res.consignment_id}
            address={`${receiver.address}, ${receiver.city_district}, ${receiver.state}`}
            pincode={receiver.pincode}
            mobile={receiver.phone_number}
          />
        )),
      )}
    </View>
  );
};

export default TodaysConsignment;
