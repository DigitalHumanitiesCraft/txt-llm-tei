<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <!-- Output to XML -->
    <xsl:output method="xml" indent="yes"/>
    
    <!-- Declare a variable to hold unique element names -->
    <xsl:variable name="unique-elements" as="xs:string*">
        <xsl:for-each select="collection('file:///C:/Users\PC/Desktop/data/Arbeit/DHCraft/Projekte/Git/txt-llm-tei/data/hsa/xml/?select=*.xml')//*">
            <xsl:sequence select="name()"/>
        </xsl:for-each>
    </xsl:variable>
    
    <!-- The root template -->
    <xsl:template match="/">
        <UniqueElements>
            <!-- Retrieve distinct unique element names -->
            <xsl:for-each select="distinct-values($unique-elements)">
                <Element>
                    <xsl:value-of select="."/>
                </Element>
            </xsl:for-each>
        </UniqueElements>
    </xsl:template>
</xsl:stylesheet>
