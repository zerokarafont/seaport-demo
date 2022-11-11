## 使用方法
### 上架

### 购买

### 出价

## Issue
- 不应该使用os和moralis两套api，因为取nft数据的时候是默认分页的,然而两者分页的排序参数不一致，可能第一页os能取到想要的数据（比如就要1155的）但是moralis的第一页没有1155
- opensea测试网api拿不到数据但是moralis (Rinkeby)能拿到?
- moralis拿到的数据有的没有metadata, 需要手动去token_uri中取一下?
    + 涉及到opensea的数据，请求太频繁会触发429

## TODO
- 对token_uri做兼容请求
- 对metadata标准中是image
    + opensea自己存的字段叫做image_url

