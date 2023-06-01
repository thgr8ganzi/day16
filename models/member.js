module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'member',
        {
            member_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '회원고유번호',
            },
            email: {
                type: DataTypes.STRING(100),
                primaryKey: false,
                allowNull: false,
                comment: '사용자메일주소',
            },
            password: {
                type: DataTypes.STRING(200),
                primaryKey: false,
                allowNull: false,
                comment: '비밀번호',
            },
            name: {
                type: DataTypes.STRING(50),
                primaryKey: false,
                allowNull: false,
                comment: '사용자이름',
            },
            telephone: {
                type: DataTypes.STRING(50),
                primaryKey: false,
                allowNull: true,
                comment: '전화번호',
            },
        },
        {
            timestamps: true,
            paranoid: true,
        });
};