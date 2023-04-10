import React, { useState,useEffect } from "react";
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
	showModal: boolean;
}

const ModalBox: React.FC<ModalBoxProps> = ({
	title,
	value,
	onSave,
	onCancel,
	showModal,
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

	return (
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
	);
};

export default ModalBox;
