import torch
print(torch.version.cuda)   # CUDA版本
print(torch.cuda.is_available())   # torch能否成功调用CUDA
# pip3 install torch==2.0.1+cu118 torchvision==0.15.2+cu118 torchaudio==2.0.2+cu118 --extra-index-url https://download.pytorch.org/whl/cu118