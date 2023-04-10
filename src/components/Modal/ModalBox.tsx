import React, { useState,useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
	Modal,
	FormControl,
	Input,
	Button,
	NativeBaseProvider,
} from "native-base";
// import { useUserStore } from "@/hooks/useStore";

interface ModalBoxProps {
	title: string;
	value: string;
	onSave: (newValue: string) => void;
	onCancel: () => void;
    onLogout: () => void;
	showModal: boolean;
    showLogoutConfirmationModal: boolean;
}

const ModalBox: React.FC<ModalBoxProps> = ({
	title,
	value,
	onSave,
	onCancel,
    onLogout,
	showModal,
    showLogoutConfirmationModal,
}) => {
	const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        // Update the newValue state whenever the value prop changes
        setNewValue(value);
      }, [value]);

	const handleSave = () => {
		onSave(newValue);
        
	};

	const handleCancel = () => {
		setNewValue(value);
        onCancel();
	};

    const handleLogout = () => {
        onLogout();
    };


	return (
        <View>
		<Modal isOpen={showModal} onClose={handleCancel}>
			<Modal.Content>
				<Modal.Header className="flex flex-row">Edit {title}</Modal.Header>
				<Modal.Body>
					<FormControl>
						<Input
							placeholder={`Enter new ${title}`}
							value={newValue}
							onChangeText={(value) => setNewValue(value)}
						/>
					</FormControl>
				</Modal.Body>
				<Modal.Footer>
					<Button.Group variant="ghost" space={2}>
						<Button onPress={handleCancel}>Cancel</Button>
						<Button onPress={handleSave}>Save</Button>
					</Button.Group>
				</Modal.Footer>

                

			</Modal.Content>
		</Modal>
        <Modal isOpen={showLogoutConfirmationModal} onClose={handleCancel}>
        <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Logout Confirmation</Modal.Header>
            <Modal.Body>
                <View>
                <Text>Are you sure you want to logout?</Text></View>
            </Modal.Body>
            <Modal.Footer>
                <Button onPress={handleCancel}>Cancel</Button>
                <Button
                    colorScheme="danger"
                    onPress={() => {
                        handleLogout
                    }}
                >
                    Logout
                </Button>
            </Modal.Footer>
        </Modal.Content>
    </Modal>
    </View>
	);
};

export default ModalBox;
