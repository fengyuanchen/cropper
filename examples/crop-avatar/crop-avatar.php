<?php
    include 'class.thumbhandler.php'; // Class ThumbHandler

    class CropAvatar {
        private $src;
        private $data;
        private $file;
        private $dist;
        private $msg;

        function __construct($src, $data, $file) {
            if (!empty($src)) {
                $this -> setSrc($src);
                $this -> setDist($this -> getPathInfo($src)['type']);
            }

            if (!empty($data)) {
                $this -> setData($data);
            }

            if (!empty($file)) {
                $this -> setFile($file);
            }

            if (!empty($this -> src) && !empty($this -> dist) && !empty($this -> data)) {
                $this -> crop($this -> src, $this -> dist, $this -> data);
            } else {
                $this -> dist = "";
            }
        }

        public function setSrc($src) {
            $this -> src = $src;
        }

        public function setData($data) {
            $this -> data = json_decode(stripslashes($data));
        }

        public function setFile($file) {
            if ($file['error'] === 0) {
                $info = $this -> getPathInfo($file['name']);
                $src  = $this -> makeDir('img/upload') . '/' . md5($info['name']) . '.' . $info['type'];

                if (in_array($info['type'], array('jpg','jpeg','gif','png'))) {

                    if (file_exists($src)) {
                        unlink($src);
                    }

                    $result = move_uploaded_file($file['tmp_name'], $src);

                    if ($result) {
                        $this -> src = $src;
                        $this -> setDist($info['type']);
                    } else {
                         $this -> msg = 'File saving failed!';
                    }
                } else {
                    $this -> msg = 'Please upload image file with the following extensions: jpg, png, gif.';
                }
            } else {
                if (empty($this -> src)) {
                    $this -> msg = 'File upload failed! Error code: ' . $file['error'];
                }
            }
        }

        public function setDist($type) {
            $this -> dist = $this -> makeDir('img/avatar') . '/' . date('YmdHis') . '.' . $type;
        }

        public function crop($src, $dist, $data) {
            $crop = new ThumbHandler();
            $crop -> setSrcImg($src);
            $crop -> setCutType(2);
            $crop -> setSrcCutPosition($data -> x1, $data -> y1);
            $crop -> setRectangleCut($data -> width, $data -> height);
            $crop -> setImgDisplayQuality(100);
            $crop -> setDstImg($dist);
            $crop -> createImg($data -> width, $data -> height);
        }

        public function getPathInfo($path) {
            $info = pathinfo($path);
            $type  = $info['extension'];
            $name  = strtr($info['basename'], '.' . $type, '');

            return array(
                'name' => $name,
                'type' => $type
            );
        }

        public function makeDir($dir) {
            if (!file_exists($dir)) {
                mkdir($dir, 0777);
            }

            return $dir;
        }

        public function getResult() {
            return !empty($this -> dist) ? $this -> dist : $this -> src;
        }

        public function getMsg() {
            return $this -> msg;
        }
    }

    $crop = new CropAvatar($_POST['avatar_src'], $_POST['avatar_data'], $_FILES['avatar_file']);
    $response = array(
        'state'  => 200,
        'result' => $crop -> getResult(), // src, dist
        'error' => $crop -> getMsg() // msg
    );

    echo json_encode($response);
?>
