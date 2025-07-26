// Just retrieving the image file saving it


// import { db } from '@/lib/db';
// import serverAuth from '@/lib/serverAuth';

// export default async function handler(req, res) {
//   if (req.method !== 'PATCH' && req.method !== 'DELETE') {
//     return res.status(405).end();
//   }

//   try {
//     const { currentUser } = await serverAuth(req, res);

//     const { username, bio, image, handle } = req.body;

//     if (req.method === 'PATCH') {
//       try {
//         // Check if the handle already exists in the user table
//         const existingUser = await db.user.findUnique({
//           where: {
//             handle: handle,
//           },
//         });

//         // If the handle exists and belongs to a different user, return an error
//         if (existingUser && existingUser.id !== currentUser.id) {
//           return res.status(409).json({ error: 'Handle is already taken.' });
//         }

//         const updatedUser = await db.user.update({
//           where: {
//             id: currentUser.id,
//           },
//           data: {
//             name: username,
//             bio: bio,
//             image: image,
//             handle: handle,
//           },
//         });

//         return res.status(200).json(updatedUser);
//       } catch (error) {
//         return new Response(`Could not update handle at this time. ${error}`, {
//           status: 500,
//         });
//       }
//     } else if (req.method === 'DELETE') {
//       await db.user.delete({
//         where: {
//           id: currentUser.id,
//         },
//       });
//       return res.status(204).end();
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).end();
//   }
// }


// const Settings = () => {
//   const { data: currentUser } = useCurrentUser();
//   const router = useRouter();

//   const [username, setUsername] = useState('');
//   const [bio, setBio] = useState('');
//   const [image, setImage] = useState('');
//   const [handle, setHandle] = useState('');

//   const { isMobile } = useMediaQuery();

//   const queryClient = useQueryClient();
//   const { data: fetchedUser } = useUser(currentUser?.handle);

//   useEffect(() => {
//     setUsername(fetchedUser?.name);
//     setBio(fetchedUser?.bio);
//     setImage(fetchedUser?.image);
//     setHandle(fetchedUser?.handle);
//   }, [
//     fetchedUser?.name,
//     fetchedUser?.bio,
//     fetchedUser?.image,
//     fetchedUser?.handle,
//   ]);

//   // edit profile details
//   const editMutation = useMutation(
//     async ({ bio, username, image, handle }) => {
//       await axios.patch('/api/edit', {
//         bio,
//         username,
//         image,
//         handle,
//       });
//     },
//     {
//       onError: () => {
//         toast.error('An error occurred');
//       },
//       onSuccess: () => {
//         queryClient.invalidateQueries('users');
//         toast.success('Changes applied');
//         signalIframe();
//       },
//     }
//   );


// import * as Dialog from '@radix-ui/react-dialog';
// import { useState, useCallback } from 'react';
// import Image from 'next/image';
// import closeSVG from '@/public/close_button.svg';
// import { Upload } from 'lucide-react';
// import { useDropzone } from 'react-dropzone';
// import { useQueryClient } from '@tanstack/react-query';
// import useCurrentUser from '@/hooks/useCurrentUser';
// import toast from 'react-hot-toast';

// const UploadModal = ({ onChange, value, submit }) => {
//   const [base64, setBase64] = useState(value);
//   const { data: currentUser } = useCurrentUser();
//   const [disableUpload, setDisableUpload] = useState(true);

//   const handleChange = useCallback(
//     (base64) => {
//       onChange(base64);
//       setDisableUpload(false);
//     },
//     [onChange]
//   );

//   const queryClient = useQueryClient();

//   const handleDrop = useCallback(
//     (files) => {
//       const file = files[0];
//       const maxSize = 5 * 1024 * 1024; // 5MB

//       if (file.size > maxSize) {
//         alert('Max file size exceeded. Please upload a file under 5MB.');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setBase64(event.target.result);
//         handleChange(event.target.result);
//       };
//       reader.readAsDataURL(file);
//       queryClient.invalidateQueries(['users', currentUser?.handle]);
//     },
//     [currentUser?.handle, handleChange, queryClient]
//   );

//   const { getRootProps, getInputProps } = useDropzone({
//     maxFiles: 1,
//     onDrop: handleDrop,
//     accept: {
//       'image/jpeg': [],
//       'image/png': [],
//     },
//   });

//   const handleUploadPfp = () => {
//     if (!disableUpload) {
//       submit();
//       setBase64('');
//       setDisableUpload(true);
//     } else {
//       toast.error('No file selected: Pick an image first');
//       return;
//     }
//   };


