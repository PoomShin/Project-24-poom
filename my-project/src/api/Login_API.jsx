import { useMutation } from 'react-query';
import axios from 'axios';

const useLoginMutation = (loginEndpoint, onSuccessCallback) => {
    return useMutation(
        async (formData) => {
            const response = await axios.post(loginEndpoint, formData);
            return response.data;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => {
                console.log('Error:', error);
                if (error.response?.data?.message) {
                    alert(error.response.data.message);
                } else {
                    alert('Error logging in!');
                }
            },
        }
    );
};

export default useLoginMutation;